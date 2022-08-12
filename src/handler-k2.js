const { nanoid } = require('nanoid');
const allnotesandbooks = require('./allnotesandbooks');

const addBooksHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
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

  if (name == null) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

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

  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;

};

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

module.exports = {
    addBooksHandler,
    getAllBooksHandler,
    getBookByIdHandler,
};