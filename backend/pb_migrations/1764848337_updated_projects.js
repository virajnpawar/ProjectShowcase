/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("projects")

  // update content_blocks
  const existingContentBlocks = collection.schema.getFieldByName("content_blocks")
  if (existingContentBlocks) {
    existingContentBlocks.options = {
      "maxSize": 5242880
    }
  } else {
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
  }

  // update status
  const existingStatus = collection.schema.getFieldByName("status")
  if (existingStatus) {
    existingStatus.options = {
      "maxSelect": 1,
      "values": [
        "draft",
        "published",
        "hidden",
        "scheduled"
      ]
    }
  } else {
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
  }

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("projects")

  // revert content_blocks
  const existingContentBlocks = collection.schema.getFieldByName("content_blocks")
  if (existingContentBlocks) {
    existingContentBlocks.options = {
      "maxSize": 0
    }
  }

  // revert status
  const existingStatus = collection.schema.getFieldByName("status")
  if (existingStatus) {
    existingStatus.options = {
      "maxSelect": 0,
      "values": [
        "draft",
        "published",
        "hidden",
        "scheduled"
      ]
    }
  }

  return dao.saveCollection(collection)
})
