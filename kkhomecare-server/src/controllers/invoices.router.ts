import { InvoiceModel } from '../database/models/invoice.model';
import { Request, Response, Router } from 'express';
import { Invoice } from '@kk/core';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const { lastId, q, filter } = req.query;

  let redirect = '';
  if (q) {
    redirect += `?q=${q}`;
  }
  if (filter) {
    redirect += (redirect ? '&' : '?') + `filter=${filter}`;
  }
  if (redirect) {
    return res.redirect(`invoices/search${redirect}`);
  }

  const handleResponse = (total: number, error: Error, invoices: Invoice[]) => {
    if (error) {
      return res.status(500).json({ error, success: false });
    }
    res.status(200).json({ success: true, error: null, data: { invoices, total } })
  };

  const fetch = () => {
    return (lastId && lastId !== 'undefined') ?
      InvoiceModel.find({ _id: { $gt: lastId } }) :
      InvoiceModel.find();
  };

  InvoiceModel
    .countDocuments()
    .exec()
    .then(total => {
      fetch()
        .limit(10)
        .exec(handleResponse.bind(this, total))
    })
    .catch(error => {
      res.status(500).json({ error, success: false });
    });
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
      res.status(200).json({ success: true, data: { invoices } })
    })
    .catch(error => {
      res.status(500).json({ error, success: false });
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