import { InvoiceModel } from '../database/models/invoice.model';
import { Request, Response, Router } from 'express';
import { Invoice } from '@kk/core';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const { lastId } = req.query;
  const query = lastId ? { _id: { $gt: lastId } } : {};
  InvoiceModel
    .find(query)
    .exec()
    .then(invoices => res.status(200).json({ invoices }))
    .catch(error => res.json(500).json({ error }))
});

router.get('/search', (req: Request, res: Response) => {
  const q = req.query && <string>req.query.q;
  const filter = req.query && <string>req.query.filter;
  let nameSearch: any = {};
  let dbFilter: any = {};
  if (filter === 'past-due') {
    dbFilter.dueDate = { $lt: Date.now() };
  }
  if (filter === 'paid') {
    dbFilter.paid = true;
  }
  if (filter === 'not-sent') {
    dbFilter.sent = false;
  }
  if (q) {
    nameSearch['client.name'] = new RegExp(q, 'i');
  }
  InvoiceModel.find(Object.assign(nameSearch, dbFilter))
    .exec()
    .then(invoices => {
      res.status(200).json({ invoices })
    })
    .catch(error => {
      res.status(500).json({ error });
    })
});

router.get('/:id', (req: Request, res: Response) => {
  InvoiceModel.find({ _id: req.params.id })
    .exec()
    .then(invoice => {
      return res.status(200).json({ success: true, error: null, data: { invoices: invoice } });
    })
    .catch(error => {
      res.status(500).json({ success: false, error });
    })
});

router.post('/create', (req: Request, res: Response) => {
  const { client, total, items, dueDate } = req.body.invoice;
  InvoiceModel.create({
    client,
    total,
    items,
    dueDate,
    sent: false,
    paid: false,
    datePaid: null,
    dateSent: null
  }, (error: Error, result: any) => {
    if (error) {
      return res.status(500).json({ success: false, error });
    }
    return res.status(200).json({ success: true, error: null, data: { invoices: [result] } });
  });
});

module.exports = router;