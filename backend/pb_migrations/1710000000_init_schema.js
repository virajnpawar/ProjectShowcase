/// <reference path="../pb_data/types.d.ts" />

migrate((db) => {
    const dao = new Dao(db);

    // Helper to save collection if not exists
    const save = (col) => {
        try {
            dao.saveCollection(col);
        } catch (e) {
            console.log("Collection might already exist:", col.name, e);
        }
    }

    // 1. Categories
    const categories = new Collection({
        name: "categories",
        type: "base",
        schema: [
            { name: "name", type: "text", required: true, options: { min: 1 } },
            { name: "slug", type: "text", required: true, options: { pattern: "^[a-z0-9-]+$" } },
            { name: "description", type: "text" }
        ]
    });
    save(categories);

    // 2. Tags
    const tags = new Collection({
        name: "tags",
        type: "base",
        schema: [
            { name: "name", type: "text", required: true },
            { name: "slug", type: "text", required: true }
        ]
    });
    save(tags);

    // 3. Projects
    const projects = new Collection({
        name: "projects",
        type: "base",
        schema: [
            { name: "title", type: "text", required: true, options: { min: 3, max: 200 } },
            { name: "slug", type: "text", required: true, options: { pattern: "^[a-z0-9-]+$" } },
            { name: "excerpt", type: "text", options: { max: 300 } },
            { name: "featured_image", type: "file", options: { maxSelect: 1, maxSize: 5242880, mimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"] } },
            { name: "content_blocks", type: "json" },
            { name: "status", type: "select", options: { values: ["draft", "published", "hidden", "scheduled"] } },
            { name: "featured", type: "bool" },
            { name: "publish_date", type: "date" },
            { name: "view_count", type: "number" },
            { name: "author", type: "relation", options: { collectionId: "_pb_users_auth_", maxSelect: 1 } }
        ]
    });
    save(projects);

    // 4. Project Metadata
    const projectMetadata = new Collection({
        name: "project_metadata",
        type: "base",
        schema: [
            { name: "project", type: "relation", required: true, options: { collectionId: projects.id, maxSelect: 1, cascadeDelete: true } },
            { name: "client_name", type: "text" },
            { name: "project_date", type: "date" },
            { name: "technologies", type: "json" },
            { name: "team_members", type: "json" },
            { name: "project_type", type: "text" },
            { name: "live_url", type: "url" },
            { name: "github_url", type: "url" },
            { name: "case_study_file", type: "file", options: { maxSelect: 1, maxSize: 10485760 } }
        ]
    });
    save(projectMetadata);

    // 5. Project Categories (Junction)
    const projectCategories = new Collection({
        name: "project_categories",
        type: "base",
        schema: [
            { name: "project", type: "relation", required: true, options: { collectionId: projects.id, maxSelect: 1, cascadeDelete: true } },
            { name: "category", type: "relation", required: true, options: { collectionId: categories.id, maxSelect: 1, cascadeDelete: true } }
        ]
    });
    save(projectCategories);

    // 6. Project Tags (Junction)
    const projectTags = new Collection({
        name: "project_tags",
        type: "base",
        schema: [
            { name: "project", type: "relation", required: true, options: { collectionId: projects.id, maxSelect: 1, cascadeDelete: true } },
            { name: "tag", type: "relation", required: true, options: { collectionId: tags.id, maxSelect: 1, cascadeDelete: true } }
        ]
    });
    save(projectTags);

    // 7. Media Library
    const mediaLibrary = new Collection({
        name: "media_library",
        type: "base",
        schema: [
            { name: "file", type: "file", options: { maxSelect: 1, maxSize: 10485760 } },
            { name: "title", type: "text" },
            { name: "alt_text", type: "text" },
            { name: "file_type", type: "select", options: { values: ["image", "video", "document"] } },
            { name: "file_size", type: "number" },
            { name: "uploaded_by", type: "relation", options: { collectionId: "_pb_users_auth_", maxSelect: 1 } }
        ]
    });
    save(mediaLibrary);

    // 8. Project Analytics
    const projectAnalytics = new Collection({
        name: "project_analytics",
        type: "base",
        schema: [
            { name: "project", type: "relation", required: true, options: { collectionId: projects.id, maxSelect: 1, cascadeDelete: true } },
            { name: "views", type: "number" },
            { name: "unique_visitors", type: "number" },
            { name: "date", type: "date", required: true }
        ]
    });
    save(projectAnalytics);

}, (db) => {
    const dao = new Dao(db);
    const collections = ["project_analytics", "media_library", "project_tags", "project_categories", "project_metadata", "projects", "tags", "categories"];

    collections.forEach(name => {
        try {
            const col = dao.findCollectionByNameOrId(name);
            dao.deleteCollection(col);
        } catch (e) {
            console.log("Error deleting collection:", name, e);
        }
    });
})
