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

Kriteria 2: API Dapat Menampilkan Seluruh Buku
API yang Anda buat harus dapat menampilkan seluruh buku yang disimpan melalui route:
Method : GET
URL: /books
Server harus mengembalikan respons dengan:
Status Code : 200
Response Body:
{
    "status": "success",
    "data": {
        "books": [
            {
                "id": "Qbax5Oy7L8WKf74l",
                "name": "Buku A",
                "publisher": "Dicoding Indonesia"
            },
            {
                "id": "1L7ZtDUFeGs7VlEt",
                "name": "Buku B",
                "publisher": "Dicoding Indonesia"
            },
            {
                "id": "K8DZbfI-t3LrY7lD",
                "name": "Buku C",
                "publisher": "Dicoding Indonesia"
            }
        ]
    }
}
Jika belum terdapat buku yang dimasukkan, server bisa merespons dengan array books kosong.
{
    "status": "success",
    "data": {
        "books": []
    }
}

const getAllBooksHandler = (request, h) => {
  const books = allnotesandbooks.filter((book) => {
    if (request.query.name) {
      return book.name.toLowerCase().indexOf(request.query.name.toLowerCase()) > -1;
    }
    if (request.query.reading === '0') {
      return !book.reading;
    }
    if (request.query.reading === '1') {
      return book.reading;
    }
    if (request.query.finished === '0') {
      return !book.finished;
    }
    if (request.query.finished === '1') {
      return book.finished;
    }
    return true;
  }).map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));
  const response = h.response({
    status: 'success',
    data: {
      books,
    },
  });
  response.code(200);
  return response;
};

Kriteria 3: API Dapat Menampilkan Detail Buku
API yang Anda buat harus dapat menampilkan detail buku berdasarkan id melalui route:
Method : GET
URL: /books/{bookId}
Bila buku dengan id yang dilampirkan oleh client tidak ditemukan, server harus mengembalikan respons dengan:
Status Code : 404
Response Body:
{
    "status": "fail",
    "message": "Buku tidak ditemukan"
}
Bila buku dengan id yang dilampirkan ditemukan, server harus mengembalikan respons dengan:
Status Code : 200
Response Body:
{
    "status": "success",
    "data": {
        "book": {
            "id": "aWZBUW3JN_VBE-9I",
            "name": "Buku A Revisi",
            "year": 2011,
            "author": "Jane Doe",
            "summary": "Lorem Dolor sit Amet",
            "publisher": "Dicoding",
            "pageCount": 200,
            "readPage": 26,
            "finished": false,
            "reading": false,
            "insertedAt": "2021-03-05T06:14:28.930Z",
            "updatedAt": "2021-03-05T06:14:30.718Z"
        }
    }
}
const getBookByIdHandler = (request, h) => {
  const { id } = request.params;
 
  const book = allnotesandbooks.filter((n) => n.id === id)[0];
 
  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

Kriteria 4: API Dapat Mengubah Data Buku
API yang Anda buat harus dapat mengubah data buku berdasarkan id melalui route:
Method : PUT
URL : /books/{bookId}
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
Server harus merespons gagal bila:
Client tidak melampirkan properti name pada request body. Bila hal ini terjadi, server akan merespons dengan:
Status Code : 400
Response Body:
{
    "status": "fail",
    "message": "Gagal memperbarui buku. Mohon isi nama buku"
}
 
    if (name == null) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      });
      response.code(400);
      return response;
    }


Client melampirkan nilai properti readPage yang lebih besar dari nilai properti pageCount. Bila hal ini terjadi, server akan merespons dengan:
Status Code : 400
Response Body:
{
    "status": "fail",
    "message": "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount"
}
    
if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);
      return response;
    }
Id yang dilampirkan oleh client tidak ditemukkan oleh server. Bila hal ini terjadi, server akan merespons dengan:
Status Code : 404
Response Body:
{
    "status": "fail",
    "message": "Gagal memperbarui buku. Id tidak ditemukan"
}
Bila buku berhasil diperbarui, server harus mengembalikan respons dengan:
Status Code : 200
Response Body:
{
    "status": "success",
    "message": "Buku berhasil diperbarui"
}
const editBookByIdHandler = (request, h) => {
    const { id } = request.params;
    const {
      name, year, author, summary, publisher, pageCount, readPage, reading,
    } = request.payload;
    const updatedAt = new Date().toISOString();
    const finished = pageCount === readPage;
 
    if (name == null) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      });
      response.code(400);
      return response;
    }
 
    if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);
      return response;
    }
    const index = allnotesandbooks.findIndex((book) => book.id === id);
    if (index !== -1) {
      allnotesandbooks[index] = {
        ...allnotesandbooks[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        updatedAt,
        finished,
      };
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
      });
      response.code(200);
      return response;
    }
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  };

Kriteria 5: API Dapat Menghapus Buku
API yang Anda buat harus dapat menghapus buku berdasarkan id melalui route berikut:
Method : DELETE
URL: /books/{bookId}
Bila id yang dilampirkan tidak dimiliki oleh buku mana pun, server harus mengembalikan respons berikut:
Status Code : 404
Response Body:
{
    "status": "fail",
    "message": "Buku gagal dihapus. Id tidak ditemukan"
}
Bila id dimiliki oleh salah satu buku, buku tersebut harus dihapus dan server mengembalikan respons berikut:
Status Code : 200
Response Body:
{
    "status": "success",
    "message": "Buku berhasil dihapus"
}
  const deleteBookByIdHandler = (request, h) => {
    const { id } = request.params;
 
    const index = allnotesandbooks.findIndex((book) => book.id === id);
 
    if (index !== -1) {
      allnotesandbooks.splice(index, 1);
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil dihapus',
      });
      response.code(200);
      return response;
    }
 
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  };

Pengujian API
Ketika membangun Bookshelf API, tentu Anda perlu menguji untuk memastikan API berjalan sesuai dengan kriteria yang ada. Kami sudah menyediakan berkas Postman Collection dan Environment yang dapat Anda gunakan untuk pengujian. Silakan unduh berkasnya pada tautan berikut:
Postman Bookshelf API Test Collection dan Environment
https://github.com/dicodingacademy/a261-backend-pemula-labs/raw/099-shared-files/BookshelfAPITestCollectionAndEnvironment.zip
Anda perlu meng-import kedua berkas tersebut pada Postman untuk menggunakannya. Caranya, ekstrak berkas yang sudah diunduh hingga menghasilkan dua berkas file JSON.

Kemudian, pada aplikasi Postman, klik tombol import yang berada di atas panel kiri aplikasi Postman.

Usai itu, klik tombol Upload Files untuk meng-import kedua berkas JSON hasil ekstraksi.

Setelah itu, Bookshelf API Test Collection dan Environment akan tersedia pada Postman Anda.
Collection

Environment



Kriteria Penilaian Submission
Submission Anda akan dinilai oleh Reviewer guna menentukan kelulusan Anda. Untuk lulus dari kelas ini, proyek Bookshelf API harus memenuhi seluruh pengujian otomatis pada Postman request yang bertanda [Mandatory]. Bila salah satu pengujiannya gagal, proyek Anda akan kami tolak.
Submission Anda akan dinilai oleh Reviewer dengan skala 1-5. Untuk mendapatkan nilai tinggi, silakan penuhi pengujian otomatis pada request yang bertanda [Optional]. Berikut detail dari fitur atau persyaratan opsional dari submission ini:
Tambahkan fitur query parameters pada route GET /books (Mendapatkan seluruh buku).
?name: Tampilkan seluruh buku yang mengandung nama berdasarkan nilai yang diberikan pada query ini. Contohnya, /books?name=”dicoding” akan menampilkan daftar buku yang mengandung nama “dicoding” secara non-case sensitive  (tidak peduli besar dan kecil huruf).
?reading: Bernilai 0 atau 1. Bila 0, tampilkan buku yang sedang tidak dibaca (reading: false). Bila 1, tampilkan buku yang sedang dibaca (reading: true). Selain itu, tampilkan buku, baik yang sedang dibaca maupun tidak.
?finished: Bernilai 0 atau 1. Bila 0, tampilkan buku yang sudah belum selesai dibaca (finished: false). Bila 1, tampilkan buku yang sudah selesai dibaca (finished: true). Selain itu, tampilkan buku, baik yang sudah selesai atau belum dibaca.
Menerapkan CORS pada seluruh resource yang ada.
Menggunakan ESLint dan menerapkan salah satu style guide agar gaya penulisan kode JavaScript lebih konsisten.
Berikut adalah detail penilaian submission:
Bintang 1: Semua ketentuan wajib terpenuhi, tetapi terdapat indikasi kecurangan dalam mengerjakan submission.
Bintang 2: Semua ketentuan wajib terpenuhi, tetapi terdapat kekurangan pada penulisan kode. Misalnya, tidak menerapkan modularization atau gaya penulisan tidak konsisten.
Bintang 3: Semua ketentuan wajib terpenuhi, tetapi tidak terdapat improvisasi atau persyaratan opsional yang dipenuhi.
Bintang 4: Semua ketentuan wajib terpenuhi dan menerapkan minimal satu persyaratan opsional.
Bintang 5: Semua ketentuan wajib terpenuhi dan menerapkan seluruh persyaratan opsional yang ada.
Catatan:
Jika submission Anda ditolak, maka tidak ada penilaian. Kriteria penilaian bintang di atas hanya berlaku jika submission Anda lulus.


Ketentuan Berkas Submission
Berkas submission yang dikirim merupakan folder proyek dari Bookshelf API dalam bentuk ZIP. 
Pastikan di dalam folder proyek yang Anda kirim terdapat berkas package.json.
Pastikan Anda hapus dulu berkas node_modules pada folder proyek sebelum mengompresnya dalam bentuk ZIP.

Submission Anda akan Ditolak bila
Kriteria wajib Bookshelf API tidak terpenuhi.
Ketentuan berkas submission tidak terpenuhi.
Proyek yang Anda kirim tidak dapat dijalankan dengan baik (Reviewer menggunakan Node.js versi LTS 14.17.0).
Menggunakan bahasa pemrograman dan teknologi lain selain JavaScript dan Node.js.
Menggunakan Framework Node.js selain Hapi Framework.
Melakukan kecurangan seperti tindakan plagiasi.
