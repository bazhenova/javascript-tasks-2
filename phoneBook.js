'use strict';

var phoneBook = []; // Здесь вы храните записи как хотите -> хочу лист словарей ^^
var max_name_length = 5; // для вывода
var max_email_length = 7;
/*
   Функция добавления записи в телефонную книгу.
   На вход может прийти что угодно, будьте осторожны.
*/
module.exports.add = function add(name, phone, email) {
    if (isNameCorrect(name) && isEmailCorrect(email) && isPhoneCorrect(phone)) {
        var contact = {
            name: name,
            phone: phone,
            email: email
        };
        phoneBook.push(contact);
        if (email.length > max_email_length) {
            max_email_length = email.length;
        }
        if (name.length > max_name_length) {
            max_name_length = name.length;
        }
        return true;
    }
    return false;
};

function isNameCorrect(name) {
    return (name !== 'undefined' && name.length > 0);
}

function isEmailCorrect(email) {
    if (typeof email !== 'string' || email.length === 0) {
        return false;
    }
    var reg = /^[^@]+@[^@]+(\.[^@]+)+$/i;
    return reg.test(email);
}

function isPhoneCorrect(phone) {
    if (typeof phone !== 'string' || phone.length === 0) {
        return false;
    }
    var reg = /^(\+?\d{1,2}\s*)?(\(\d{3}\)|\d{3})+\s*\d{3}(\s*|\-)?\d(\s*|\-)?\d{3}$/;
    return reg.test(phone);
}

/*
   Функция поиска записи в телефонную книгу.
   Поиск ведется по всем полям.
*/
module.exports.find = function find(query) {
    var records = [];
    if (typeof query !== 'undefined') {
        query = query.toLowerCase();
        for (var i = 0; i < phoneBook.length; i++) {
            var record = phoneBook[i];
            var keys = Object.keys(record);
            for (var j = 0; j < keys.length; j++) {
                var lowerRecord = record[keys[j]].toLowerCase();
                if (lowerRecord.indexOf(query) !== -1) {
                    records.push(record);
                    break;
                }
            }
        }
    }
    console.log('По запросу найдено: ' + records.length);
    for (var i = 0; i < records.length; i++) {
        console.log(getRecord(records[i]));
    }
    console.log('');
    return records;
};

function getRecord(record) {
    var info = record.name + ', ' + record.phone + ', ' + record.email;
    return info;
}
/*
   Функция удаления записи в телефонной книге.
*/
module.exports.remove = function remove(query) {
    var records = module.exports.find(query);
    filterBook(records);
};

function filterBook(records) {
    var indices = getIndices(records);
    for (var i = indices.length - 1; i >= 0; i--) {
        phoneBook.splice(indices[i], 1);
    }
    console.log('Удалено: ' + indices.length + '\n');
}

function getIndices(records) {
    var indices = [];
    for (var i = 0; i < records.length; i++) {
        for (var j = 0; j < phoneBook.length; j++) {
            if (records[i] === phoneBook[j]) {
                indices.push(j);
            }
        }
    }
    return indices;
}

/*
   Функция импорта записей из файла (задача со звёздочкой!).
*/
module.exports.importFromCsv = function importFromCsv(filename) {
    var data = require('fs').readFileSync(filename, 'utf-8');
    var count = 0;
    var records = data.split('(\r\n|\n)');
    for (var i in records) {
        var record = records[i].split(';');
        if (module.exports.add(record[0], record[1], record[2])) {
            count++;
        }
    }
    console.log('Добавлено записей:' + count);
};


/*
   Функция вывода всех телефонов в виде ASCII (задача со звёздочкой!).
*/
module.exports.showTable = function showTable() {
    var borders = createBorders();
    console.log(borders[0] + '\n' + borders[1]);
    for (var i = 0; i < phoneBook.length; i++) {
        console.log(borders[2]);
        var record = createBetter(phoneBook[i]);
        console.log('│' + record[0] + '│' + record[1] + '║' + record[2] + '│');
    }
    console.log(borders[3]);
};

function createBetter(record) {
    var newRecord = [];
    if (record.name.length < max_name_length) {
        var newName = record.name;
        for (var i = 0; i < max_name_length - record.name.length; i++) {
            newName += ' ';
        }
        newRecord.push(newName);
    } else {
        newRecord.push(record.name);
    }
    newRecord.push(updatePhone(record.phone));
    if (record.email.length < max_email_length) {
        var newEmail = record.email;
        for (var i = 0; i < max_email_length - record.email.length; i++) {
            newEmail += ' ';
        }
        newRecord.push(newEmail);
    } else {
        newRecord.push(record.email);
    }
    return newRecord;
}

function createBorders() {
    var borders = [];
    var first = '┌─────';
    var second = '│ Имя ';
    var last = '└─────';
    var between = '├─────';
    for (var i = 0; i < max_name_length - 5; i++) {
        first += '─';
        second += ' ';
        between += '─';
        last += '─';
    }
    first += '┬────────────────────╥───────';
    second += '│ Телефон            ║ email ';
    between += '┼────────────────────╫───────';
    last += '┴────────────────────╨───────';
    for (var j = 0; j < max_email_length - 7; j++) {
        first += '─';
        second += ' ';
        between += '─';
        last += '─';
    }
    first += '┐';
    second += '│';
    between += '┤';
    last += '┘';
    borders.push(first);
    borders.push(second);
    borders.push(between);
    borders.push(last);
    return borders;
}

function updatePhone(phone) {
    phone = phone.replace(/[^\d]+/g, '');
    var formatted = '+' + (phone.slice(0, -10) || 7) + ' ' +
    phone.slice(-10).replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, '($1) $2-$3-$4');
    return formatted + '  ';
}
