require('dotenv').config();
import fs from 'fs';
import { ImageModel } from '../database/models/image.model';
import { BeforeAfterModel } from '../database/models/before-after.model';
import { Request, Response, Router, Express } from 'express';
import multer from 'multer';
import cloudinary from 'cloudinary';

const router = Router();

const upload = multer({ dest: 'uploads/' });

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

const getBeforeAfter = (fetchAll: boolean, getTotal: boolean, offset: number) => {
  return new Promise((resolve, reject) => {
    if (fetchAll) {
      BeforeAfterModel
        .countDocuments()
        .exec()
        .then(total => {
          BeforeAfterModel
            .find()
            .exec()
            .then(images => resolve({ total, images, success: true }))
            .catch(err => reject({ error: err, success: false }))
        }).catch(err => reject({ error: err, success: false }))
    } else {
      if (getTotal) {
        BeforeAfterModel
          .countDocuments()
          .exec()
          .then(total => {
            BeforeAfterModel
              .find()
              .skip(offset)
              .limit(1)
              .exec()
              .then(images => resolve({ total, images, success: true }))
              .catch(err => reject({ error: err, success: false }))
          }).catch(err => reject({ error: err, success: false }))
      } else {
        BeforeAfterModel
          .find()
          .skip(offset)
          .limit(1)
          .exec()
          .then(images => resolve({ images, success: true }))
          .catch(err => reject({ error: err, success: false }))
      }
    }
  });
};

const getPhotos = (fetchAll: boolean, getTotal: boolean, lastId: number, limit: number) => {
  return new Promise((resolve, reject) => {
    if (fetchAll) {
      ImageModel
        .countDocuments()
        .exec()
        .then(total => {
          ImageModel
            .find()
            .exec()
            .then(images => resolve({ images, total, success: true }))
            .catch(err => reject({ error: err, success: false }))
        })
        .catch(err => reject(err))
    } else {
      const query = lastId ? { _id: { $gt: lastId } } : {};
      if (getTotal) {
        ImageModel
          .countDocuments()
          .exec()
          .then(total => {
            ImageModel
              .find(query)
              .limit(limit)
              .exec()
              .then(images => resolve({ total, images, success: true }))
              .catch(err => reject({ error: err, success: false }))
          })
          .catch(err => reject(err))
      } else {
        ImageModel
          .find(query)
          .limit(limit)
          .exec()
          .then(images => resolve({ images, success: true }))
          .catch(err => reject({ error: err, success: false }))
      }
    }
  });
}

router.post('/', (req: Request, res: Response) => {
  const {
    limit,
    offset,
    lastId,
    getTotal,
    fetchAll,
    beforeAfter
  } = req.body;
  if (beforeAfter) {
    getBeforeAfter(fetchAll, getTotal, offset)
      .then(result => res.json(result))
      .catch(error => res.sendStatus(500).json(error))
  } else {
    getPhotos(fetchAll, getTotal, lastId, limit)
      .then(result => res.json(result))
      .catch(error => res.sendStatus(500).json(error))
  }
});

router.post('/before-after/upload', upload.array('photos', 2), (req: Request, res: Response) => {

  const uploadedImages: { url: string }[] = [];
  const upload = async () => {

    const uploadToCloudinary = (file: Express.Multer.File): Promise<any> => {
      return new Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload(
          file.path,
          { folder: '2K Homecare/before-after' },
          (err, res) => {
            fs.unlink(file.path, (err) => {
              if (err) {
                console.error(err)
              }
            });
            if (err) {
              return reject(err);
            }
            resolve(res);
          });
      });
    };
    const files = req.files as Express.Multer.File[];
    for (let i = 0; i < files.length; i++) {
      try {
        const result = await uploadToCloudinary(files[i]);
        uploadedImages.push(result);
      } catch (error) {
        console.error(error);
      }

    }

    if (uploadedImages && uploadedImages.length === 2) {
      BeforeAfterModel.create({
        beforeUrl: uploadedImages[0].url,
        afterUrl: uploadedImages[1].url
      }, (error: Error, result: any) => {
        if (error) {
          res.sendStatus(500).json({ success: null, error });
        } else {
          res.json({ success: true, error: null, images: uploadedImages });
        }
      })
    } else {
      res.sendStatus(500).json({ success: false, error: 'Something went wrong' })
    }

  };

  upload();

});

router.post('/upload', upload.array('photos', 12), (req, res) => {

  console.log('UPLOADING:::: ', process.env.CLOUDINARY_API_KEY);

  const { tag } = req.query;

  const uploadedImages: any[] = [];
  const upload = async () => {

    const uploadToCloudinary = (file: Express.Multer.File) => {
      return new Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload(
          file.path,
          { tags: [tag], folder: `2K Homecare/${tag}` },
          (err, res) => {
            fs.unlink(file.path, (err) => {
              if (err) {
                console.error(err)
              }
            });
            if (err) {
              return reject(err);
            }
            resolve(res);
          });
      });
    };
    const files = req.files as Express.Multer.File[];
    for (let i = 0; i < files.length; i++) {
      try {
        const result = await uploadToCloudinary(files[i]);
        uploadedImages.push(result);
      } catch (err) {
        console.error(err);
      }
    }

    console.log('UPLOADED', uploadedImages)
    if (uploadedImages && uploadedImages.length) {
      const errored = [];

      const saveToDb = (image: any) => {
        return new Promise((resolve, reject) => {
          ImageModel.create({
            url: image.url,
            tag: image.tags[0]
          }, (error: Error, result: any) => {
            if (error) {
              reject({ error, image });
            } else {
              console.log('SAVED IT')
              resolve(true);
            }
          })
        });
      }

      for (let i = 0; i < uploadedImages.length; i++) {
        try {
          const result = await saveToDb(uploadedImages[i]);
        } catch (error) {
          errored.push(error);
        }
      }
      if (!errored.length) {
        return res.json({ success: true, error: null, images: uploadedImages });
      }
      res.json({ success: false, error: errored, images: uploadedImages });
    } else {
      res.sendStatus(500).json({ success: false, error: 'Something went wrong' })
    }
  };

  upload();

});

module.exports = router;