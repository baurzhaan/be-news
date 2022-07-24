exports.errorHandler = (error, _request, response, next) => {
  switch (error.code) {
    case 'articleIdisNaN': response.status(400).send({ msg: 'Invalid article ID: not a number' }); break;
    case 'missingProperty': response.status(400).send({ msg: 'Invalid request: missing property' }); break;
    case 'sqlUndefinedColumn': response.status(400).send({ msg: 'Invalid request: invalid column to sort by' }); break;
    // case 'sqlSyntaxError': response.status(400).send({ msg: 'Invalid request: SQL syntax error' }); break;
    case 'commentIdNotValid': response.status(400).send({ msg: 'Invalid request: comment ID is not valid' }); break;
    case 'commentIdisNaN': response.status(400).send({ msg: 'Invalid comment ID: not a number' }); break;
    case 'ArticleTitleIsFalsy': response.status(400).send({ msg: 'Article title cannot be empty' }); break;
    case 'ArticleTopicIsFalsy': response.status(400).send({ msg: 'Article topic cannot be empty' }); break;
    case 'ArticleAuthorIsFalsy': response.status(400).send({ msg: 'Article author cannot be empty' }); break;
    case 'ArticleBodyIsFalsy': response.status(400).send({ msg: 'Article body cannot be empty' }); break;
    case 'invalidRequest': response.status(400).send({ msg: 'Invalid request' }); break;
    
    //
    case 'userNotFound': response.status(404).send({ msg: 'User not found' }); break;
    case 'authorNotFound': response.status(404).send({ msg: 'Author not found' }); break;
    case 'articleNotFound': response.status(404).send({ msg: 'Article not found' }); break;
    case 'commentNotFound': response.status(404).send({ msg: 'Comment not found' }); break;
    case 'topicNotFound': response.status(404).send({ msg: 'Topic not found' }); break;

    default: next(error);
  };
}