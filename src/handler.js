/* eslint-disable linebreak-style */

const { nanoid } = require('nanoid');
const books = require('./books');

// menyimpan buku
const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  // Properti yang didapatkan di sisi server
  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  // cek jika client tidak melampirkan name pada request body
  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(201);
    return response;
  }

  // cek client input readPage lebih besar dari pageCount
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  // push ke array di books.js
  books.push(newBook);

  // jika input sukses maka isi variabel ini akan lebih dari 1
  const isSuccess = books.filter((note) => note.id === id).length > 0;

  // maka jika lebih dari 1 maka mengembalikkan sukses
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        noteId: id,
      },
    });
    response.code(201);
    return response;
  }
  // generic error
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

// menampilkan seluruh buku
const getAllBooksHandler = (request, h) => {
  const {
    name,
    reading,
    finished,
  } = request.query;

  let getBook = books;

  if (name) {
    getBook = books.filter((bn) => bn.name.toLowerCase().includes(name.toLowerCase()));
  }
  if (reading) {
    getBook = books.filter((book) => Number(book.reading) === Number(reading));
  }
  if (finished) {
    getBook = books.filter((book) => Number(book.finished) === Number(finished));
  }

  const response = h.response({
    status: 'success',
    data: {
      books: getBook.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });

  response.code(200);
  return response;
};

module.exports = { addBookHandler, getAllBooksHandler };
