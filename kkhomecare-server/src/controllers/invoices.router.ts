import { InvoiceModel } from '../database/models/invoice.model';
import { Request, Response, Router } from 'express';
import { Invoice, InvoiceQuery } from '@kk/core';
import Mailgun from 'mailgun-js';

const mg = Mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN
});
const router = Router();

export enum InvoiceFilters {
  NONE = 'none',
  PAID = 'paid',
  UNPAID = 'unpaid',
  PAST_DUE = 'past-due'
}

router.get('/', (req: Request, res: Response) => {
  const lastId: string = <string>req.query.lastId;
  const filter: InvoiceFilters = <InvoiceFilters>req.query.filter;
  const query: InvoiceQuery = lastId ? { _id: { $gt: lastId } } : {};
  if (filter) {
    if (filter === InvoiceFilters.PAID) {
      query.paid = true;
    }
    if (filter === InvoiceFilters.UNPAID) {
      query.paid = false;
    }
    if (filter === InvoiceFilters.PAST_DUE) {
      query.paid = false;
      query.dueDate = { $lt: Date.now() };
    }
  }
  InvoiceModel
    .find(query)
    .exec()
    .then(invoices => res.status(200).json({ invoices }))
    .catch(error => res.json(500).json({ error }))
});

router.get('/search', (req: Request, res: Response) => {
  const q = req.query && <string>req.query.q;
  const filter = req.query && <InvoiceFilters>req.query.filter;
  const query: InvoiceQuery = q ? { 'client.name': new RegExp(q, 'i') } : {};
  if (filter) {
    if (filter === InvoiceFilters.PAID) {
      query.paid = true;
    }
    if (filter === InvoiceFilters.UNPAID) {
      query.paid = false;
    }
    if (filter === InvoiceFilters.PAST_DUE) {
      query.paid = false;
      query.dueDate = { $lt: Date.now() };
    }
  }
  InvoiceModel.find(query)
    .exec()
    .then(invoices => {
      res.status(200).json({ invoices })
    })
    .catch(error => {
      res.status(500).json({ error });
    })
});

router.get('/unpaid', (req: Request, res: Response) => {
  InvoiceModel
    .countDocuments({ paid: false })
    .exec()
    .then(total => {
      res.status(200).json({ total })
    })
    .catch(error => res.status(500).json({ error }))
});

router.get('/:id', (req: Request, res: Response) => {
  InvoiceModel.find({ _id: req.params.id })
    .exec()
    .then(invoices => {
      return res.status(200).json({ invoices });
    })
    .catch(error => {
      res.status(500).json({ error });
    })
});

router.post('/', (req: Request, res: Response) => {
  const { client, total, items, dueDate, dateSent } = req.body.invoice;
  InvoiceModel.create({
    client,
    total,
    items,
    dueDate,
    dateSent,
    paid: false,
    datePaid: null
  }, (error: Error, invoice: Invoice) => {
    if (error) {
      return res.status(500).json({ error });
    }
    return res.status(200).json({ invoices: [invoice] });
  });
});

router.post('/reminder', (req: Request, res: Response) => {
  const _id = req.params.id;
  InvoiceModel
    .find({ _id })
    .exec()
    .then(invoice => {
      const emailData: Mailgun.messages.SendData = {
        to: invoice[0].client.email,
        from: `2K Homecare <${process.env.EMAIL_ADDRESS}>`,
        subject: `Invoice Reminder from 2K Homecare`,
        text: 'Hello! This is a friendly reminder that you have an outstanding invoice with 2K Homecare.'
      };

      mg.messages().send(emailData,
        (error: Mailgun.Error, body: Mailgun.messages.SendResponse) => {
          if (error) {
            return res.status(500).json({ error });
          }
          InvoiceModel.updateOne({ _id }, { dateSent: Date.now() })
          res.status(200).json({ error: null });
        });
    })
    .catch(error => res.status(500).json({ error }))
});

router.put('/:id', (req: Request, res: Response) => {
  const _id = req.params.id;
  InvoiceModel.updateOne({ _id }, req.body)
    .exec()
    .then(_ => {
      res.status(200).json({ error: null });
    })
    .catch(error => res.status(500).json({ error }));
});

router.delete('/:id', (req: Request, res: Response) => {
  const _id = req.params.id;
  InvoiceModel
    .deleteOne({ _id })
    .exec()
    .then(result => res.status(200).json({ error: null }))
    .catch(error => res.status(500).json({ error }))
});

module.exports = router;