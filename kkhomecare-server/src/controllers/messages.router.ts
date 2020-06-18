import dotenv from 'dotenv';
import { Request, Response, Router } from "express";
import { MessageModel } from '../database/models/message.model';
import Mailgun from 'mailgun-js';

dotenv.config();
const mg = Mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN
});

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const lastId = req.query && req.query.lastId;
  const query = lastId ? { _id: { $gt: lastId } } : {};
  console.log('HIT MESSAGES::::: ', query)
  MessageModel
    .find(query)
    .limit(10)
    .exec()
    .then(messages => {
      res.status(200).json({ success: true, messages })
    })
    .catch(error => {
      res.status(500).json({ success: false, error });
    });
});

router.get('/new', (req: Request, res: Response) => {
  MessageModel
    .countDocuments()
    .exec()
    .then(total => {
      res.status(200).json({ success: true, totalNew: total });
    })
    .catch(err => {
      res.status(500).json({ success: false, error: err });
    });
});

router.post('/', (req: Request, res: Response) => {
  const { name, email, message, phone } = req.body;
  const emailData: Mailgun.messages.SendData = {
    to: process.env.EMAIL_ADDRESS,
    from: `${name} <${email}>`,
    subject: `New Message from ${name}`,
    text: message
  };
  mg.messages().send(emailData, (err: Mailgun.Error, body: Mailgun.messages.SendResponse) => {
    if (err) {
      return res.status(500).json({ success: false, error: err });
    }
    // const replyData: Mailgun.messages.SendData = {
    //   to: email,
    //   from: `2K Homecare <${process.env.EMAIL_ADDRESS}>`,
    //   subject: 'Thank you!',
    //   text: 'Thanks for getting in touch! We will get back to you shortly.'
    // };
    // mg.messages().send(replyData);
    MessageModel.create({
      client: { name, email, phone },
      message,
      date: new Date(),
      seen: false
    })
      .then(result => {
        res.status(200).json({ success: true, error: null });
      })
      .catch(err => {
        res.status(500).json({ success: false, error: err });
      })
  })
});

router.put('/:id', (req: Request, res: Response) => {
  MessageModel.updateOne(
    { _id: req.params.id },
    { seen: true }
  )
    .exec()
    .then(result => {
      console.log(result)
      res.status(200).json({ success: true })
    })
    .catch(
      error => res.status(500).json({ success: false, error })
    )
});

router.delete('/:id', (req: Request, res: Response) => {
  MessageModel
    .deleteOne({ _id: req.params.id })
    .exec()
    .then(result => res.status(200).json({ success: true }))
    .catch(error => {
      console.log(error)
      res.status(500).json({ success: false, error })
    })
});

module.exports = router;
