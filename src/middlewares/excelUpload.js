import multer from 'multer';

const excelStorage = multer.memoryStorage();

const excelFileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel'
  ];
  const allowedExtensions = ['.xlsx', '.xls'];

  const fileExtension = file.originalname.slice(file.originalname.lastIndexOf('.')).toLowerCase();

  if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error('Only Excel files (.xlsx, .xls) are allowed'), false);
  }
};

const excelUpload = multer({
  storage: excelStorage,
  fileFilter: excelFileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB max
});

export default excelUpload;
