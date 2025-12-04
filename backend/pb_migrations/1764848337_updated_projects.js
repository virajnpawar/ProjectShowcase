/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1b9v0v49t7tpono")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "k3rzb3rr",
    "name": "content_blocks",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 5242880
    }
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "6ulhtese",
    "name": "status",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "draft",
        "published",
        "hidden",
        "scheduled"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1b9v0v49t7tpono")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "k3rzb3rr",
    "name": "content_blocks",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 0
    }
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "6ulhtese",
    "name": "status",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 0,
      "values": [
        "draft",
        "published",
        "hidden",
        "scheduled"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
