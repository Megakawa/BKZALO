const moment = require('moment');

function formatMessage(username, text, file, file2=null) {
  return {
    username,
    text,
    file,
    file2,
    time: moment().format('h:mm a')
  };
}

module.exports = formatMessage;