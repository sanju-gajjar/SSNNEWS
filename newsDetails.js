class NewsDetails {
    constructor(news) {
        this.top = news.top || false;
        this.tags = news.tags || [];
        this.author = news.author || '';
        this.approveby = news.approveby || '';
    }

    displayDetails() {
        console.log(`Top: ${this.top}`);
        console.log(`Tags: ${this.tags.join(', ')}`);
        console.log(`Author: ${this.author}`);
        console.log(`Approved By: ${this.approveby}`);
    }

    updateField(field, value) {
        if (['top', 'tags', 'author', 'approveby'].includes(field)) {
            this[field] = value;
            console.log(`${field} updated successfully.`);
        } else {
            console.log(`Invalid field: ${field}`);
        }
    }
}

// Example usage:
const news = new NewsDetails({
    top: true,
    tags: ['breaking', 'politics'],
    author: 'John Doe',
    approveby: 'Editor'
});

news.displayDetails();
news.updateField('tags', ['updated', 'news']);
news.displayDetails();