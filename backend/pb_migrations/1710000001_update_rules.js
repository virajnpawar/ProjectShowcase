/// <reference path="../pb_data/types.d.ts" />

migrate((db) => {
    const dao = new Dao(db);

    const collections = [
        "projects",
        "categories",
        "tags",
        "project_metadata",
        "project_categories",
        "project_tags",
        "media_library"
    ];

    collections.forEach((name) => {
        try {
            const collection = dao.findCollectionByNameOrId(name);
            collection.listRule = "";
            collection.viewRule = "";
            dao.saveCollection(collection);
        } catch (e) {
            console.log(`Error updating rules for ${name}:`, e);
        }
    });

}, (db) => {
    const dao = new Dao(db);

    const collections = [
        "projects",
        "categories",
        "tags",
        "project_metadata",
        "project_categories",
        "project_tags",
        "media_library"
    ];

    collections.forEach((name) => {
        try {
            const collection = dao.findCollectionByNameOrId(name);
            collection.listRule = null;
            collection.viewRule = null;
            dao.saveCollection(collection);
        } catch (e) {
            console.log(`Error reverting rules for ${name}:`, e);
        }
    });
})
