var wiki = require('wikijs').default,
    YouTube = require('youtube-node'),
    cheerio = require('cheerio');

function LessonGenerator(userQuery) {
  this.userQuery = userQuery;
};

LessonGenerator.DISAMBIGUATION_CATEGORY = 'Category:All disambiguation pages';
LessonGenerator.YOUTUBE = new YouTube();
LessonGenerator.YOUTUBE_KEY = process.env.LESSON_GEN_YOUTUBE_KEY;
LessonGenerator.YOUTUBE.setKey(LessonGenerator.YOUTUBE_KEY);
LessonGenerator.YOUTUBE_URL_PREFIX = "https://www.youtube.com/embed/";

LessonGenerator.prototype.getText = function() {
  var self = this;

  return wiki().page(this.userQuery).then(self.getContentFromPage);
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

LessonGenerator.prototype.getVideoUrl = function(callback) {
  LessonGenerator.YOUTUBE.search(this.userQuery, 5, function(error, result) {
    callback(LessonGenerator.YOUTUBE_URL_PREFIX + result.items[0].id.videoId);
  });
};

module.exports = LessonGenerator;
