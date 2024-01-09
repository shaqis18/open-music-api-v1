/* eslint-disable import/no-extraneous-dependencies */
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exception/InvariantError');
const NotFoundError = require('../../exception/NotFoundError');
const { albumsdb } = require('../../utils');

class AlbumsService {
  constructor() {
    this._pool = new Pool();
  }

  // add album function
  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
      values: [id, name, year],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  // get all albums function
  async getAllAlbums() {
    const query = {
      text: 'SELECT * FROM albums',
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  // get album by id fungction
  async getAlbumById(id) {
    const albumquery = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };
    const albumresult = await this._pool.query(albumquery);
    if (!albumresult.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }
    return albumsdb(albumresult.rows[0]);
  }

  // edit album by id function
  async editAlbumById(AlbumId, { name, year }) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, AlbumId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  // delete album by id function
  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = AlbumsService;