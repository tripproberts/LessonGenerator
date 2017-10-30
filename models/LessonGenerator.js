var wiki = require('wikijs').default,
    cheerio = require('cheerio');

function LessonGenerator() {};

LessonGenerator.DISAMBIGUATION_CATEGORY = 'Category:All disambiguation pages';

LessonGenerator.prototype.getText = function(userQuery) {
  var self = this;

  return wiki().page(userQuery).then(self.getContentFromPage);
};

LessonGenerator.prototype.getContentFromPage = function(page) {
  var self = this;

  return page.categories()
    .then(categories => {
      if (categories.indexOf(LessonGenerator.DISAMBIGUATION_CATEGORY) > -1) {
        return page.html().then(html => {
          var $ = cheerio.load(html),
              newQuery = $('ul li a').first().text();
          return wiki().page(newQuery).then(page2 => {
            return page2.summary().then(summary => {
              return summary;
            });
          });
        });
      } else {
        return page.summary().then(summary => {
          return summary;
        });
      };
    });
};

module.exports = LessonGenerator;
