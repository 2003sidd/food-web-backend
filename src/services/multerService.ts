const handleUploadService = (file: Express.Multer.File) => {
    return {
        message: 'File uploaded successfully!',
        originalName: file.originalname,
        filename: file.filename,
        path: file.path,
        size: file.size,
    };
};
export default handleUploadService;