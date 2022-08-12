# bookshelf-API-k1
Bookshelf API Kriteria 1 : API Dapat Menyimpan Buku

API yang Anda buat harus dapat menyimpan buku melalui route:
Method : POST
URL : /books
Body Request:
{
    "name": string,
    "year": number,
    "author": string,
    "summary": string,
    "publisher": string,
    "pageCount": number,
    "readPage": number,
    "reading": boolean
}
Objek buku yang disimpan pada server harus memiliki struktur seperti contoh di bawah ini:
{
    "id": "Qbax5Oy7L8WKf74l",
    "name": "Buku A",
    "year": 2010,
    "author": "John Doe",
    "summary": "Lorem ipsum dolor sit amet",
    "publisher": "Dicoding Indonesia",
    "pageCount": 100,
    "readPage": 25,
    "finished": false,
    "reading": false,
   "insertedAt": "2021-03-04T09:11:44.598Z",
   "updatedAt": "2021-03-04T09:11:44.598Z"
}

routes.js
{
  method: 'POST',
  path: '/books',
  handler: addBooksHandler,
},

Properti yang ditebalkan diolah dan didapatkan di sisi server. Berikut penjelasannya:
id: nilai id haruslah unik. Untuk membuat nilai unik, Anda bisa memanfaatkan nanoid.
npm install nanoid@3.x.x

const { nanoid } = require('nanoid');
 
const addBooksHandler = (request, h) => {
  const { title, tags, body } = request.payload;
 
  const id = nanoid(16);
};


finished: merupakan properti boolean yang menjelaskan apakah buku telah selesai dibaca atau belum. Nilai finished didapatkan dari observasi pageCount === readPage.
 const finished = pageCount === readPage;
 const newBook = {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    id,
    insertedAt,
    updatedAt,
  };
  
insertedAt: merupakan properti yang menampung tanggal dimasukkannya buku. Anda bisa gunakan new Date().toISOString() untuk menghasilkan nilainya.
 const createdAt = new Date().toISOString();
 
updatedAt: merupakan properti yang menampung tanggal diperbarui buku. Ketika buku baru dimasukkan, berikan nilai properti ini sama dengan insertedAt.
 const updatedAt = createdAt;


Server harus merespons gagal bila:
Client tidak melampirkan properti name pada request body. Bila hal ini terjadi, maka server akan merespons dengan:
Status Code : 400
Response Body:
{
    "status": "fail",
    "message": "Gagal menambahkan buku. Mohon isi nama buku"
}

 if (name == null) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  
  
Client melampirkan nilai properti readPage yang lebih besar dari nilai properti pageCount. Bila hal ini terjadi, maka server akan merespons dengan:
Status Code : 400
Response Body:
{
    "status": "fail",
    "message": "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
}

if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }
  
  
Server gagal memasukkan buku karena alasan umum (generic error). Bila hal ini terjadi, maka server akan merespons dengan:
Status Code : 500
Response Body:
{
    "status": "error",
    "message": "Buku gagal ditambahkan"
}

const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

Bila buku berhasil dimasukkan, server harus mengembalikan respons dengan:
Status Code : 201
Response Body:
{
    "status": "success",
    "message": "Buku berhasil ditambahkan",
    "data": {
        "bookId": "1L7ZtDUFeGs7VlEt"
    }
}
<b>
allnotesandbooks.push(newBook);
const isSuccess = allnotesandbooks.filter((book) => book.id === id).length > 0;
if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
 }
</b>
