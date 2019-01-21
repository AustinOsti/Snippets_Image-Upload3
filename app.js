const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');

// Set Storage engine
const storage = multer.diskStorage({
	destination: './public/uploads/',
	filename: function (req, file, cb) {
		cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
	}
});

//Init upload
const upload = multer({
	storage: storage,
	limits: {fileSize: 1000000},
	fileFilter: function (req, file, cb) {
		checkFileType(file, cb);
	}
}).single('myImage');

// 

function checkFileType(file, cb) {
	// allowed filetypes
	const filetypes = /jpeg|jpg|png|gif/;
	// check extends
	const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
	// check mime type
	const mimetype = filetypes.test(file.mimetype);
	
	if (extname && mimetype) {
		return cb(null, true);
	} else {
		cb('Error: Image File Only');
	}	
}


// Init app 
const app = express();

app.use(express.static('./public'));

app.set ('view engine', 'ejs');

app.get('/', function (req, res) {
	res.render('index');
});

app.post('/upload', function (req, res) {
	upload(req, res, function(err) {
		if (err) {
			res.render('index', {
				msg: err
			}); 
		} else {
			if (!req.file){
				res.render('index', {
					msg: 'Error: No File Selected'
				}); 
			} else {
				res.render('index', {
					msg: 'File Uploaded',
					file: './uploads/' + req.file.filename					
				}); 				
			}
			console.log(req.file);
		}
	});
});

const port = 3000;

app.listen(port, () => console.log('Server started on port '+ port));
