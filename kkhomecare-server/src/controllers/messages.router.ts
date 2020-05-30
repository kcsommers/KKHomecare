import { Request, Response, Router } from "express";
import { MessageModel } from '../database/models/message.model';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  MessageModel
    .countDocuments()
    .exec()
    .then(total => {
      MessageModel
        .find()
        .exec()
        .then(messages => {
          res.status(200).json({ success: true, data: { messages, total } })
        })
        .catch(error => {
          res.status(500).json({ success: false, error });
        });
    })
    .catch(err => {
      res.status(500).json({ success: false, error: err });
    });

});

router.post('/', (req: Request, res: Response) => {
  const { name, email, message, phone, jobType } = req.body;
  MessageModel.create({
    client: { name, email, phone },
    message,
    jobType,
    date: new Date(),
    seen: false
  }, (error: Error, result: any) => {
    if (error) {
      res.sendStatus(500).json({ success: null, error });
    } else {
      res.json({ success: true, error: null });
    }
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
