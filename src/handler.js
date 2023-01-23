const { nanoid } = require("nanoid");
const books = require("./books");

const addBookHandler = (request, h) => {
    // ambil payload yang dikirim user
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const id = nanoid(16);
    const finished = pageCount===readPage ? true : false ;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    if(name == null){
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        })

        response.code(201);
        return response;
    }else if(readPage >= pageCount){
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        })

        response.code(400);
        return response;
    };

    
    // ditampung semuanya
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
        updatedAt
    };

    // masukkan / push ke array di books.js
    books.push(newBook);

    // untuk cek apabila datanya ke insert otomatis hasil dari high order function 1 jika gagal maka 0
    const isSuccess = books.filter((note) => note.id === id).length > 0;

    // maka jika lebih dari 1 maka mengembalikkan sukses
    if (isSuccess) {
        // h yaitu untuk response ke client
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
        //   jika gagal
      const response = h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan',
      });
      response.code(500);
      return response;
}

const getAllBooksHandler = (request, h) => {
    if(books.length > 0){
        const dataBook = []
        books.map((b) => dataBook.push(b.id, b.name));
    }

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

module.exports = {addBookHandler, getAllBooksHandler}