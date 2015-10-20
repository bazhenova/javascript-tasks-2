'use strict';

var phoneBook = []; // Здесь вы храните записи как хотите -> хочу лист словарей ^^
var maxNameLength = 5; // для вывода
var maxEmailLength = 7;
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
        if (email.length > maxEmailLength) {
            maxEmailLength = email.length;
        }
        if (name.length > maxNameLength) {
            maxNameLength = name.length;
        }
        return true;
    }
    return false;
};

function isNameCorrect(name) {
    return (name || false) && typeof name === 'string';
}

function isEmailCorrect(email) {
    var reg = /^[^@]+@[^@]+(\.[^@]+)+$/i;
    return typeof email === 'string' && email.length > 0 && reg.test(email);
}

function isPhoneCorrect(phone) {
    var reg = /^(\+?\d{1,2}\s*)?(\(\d{3}\)|\d{3})+\s*\d{3}(\s*|\-)?\d(\s*|\-)?\d{3}$/;
    return typeof phone === 'string' && phone.length > 0 && reg.test(phone);
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
    return record.name + ', ' + record.phone + ', ' + record.email;
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
    var records = data.split('\r\n');
    for (var i = 0; i < records.length; i++) {
        var record = records[i].split(';');
        console.log(record);
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
        console.log('│' + record[0] + '│' + record[1] + '  ║' + record[2] + '│');
    }
    console.log(borders[3]);
};

function createBetter(record) {
    var newRecord = [];
    newRecord.push(padString(record.name, maxNameLength));
    newRecord.push(updatePhone(record.phone));
    newRecord.push(padString(record.email, maxEmailLength));
    return newRecord;
}

function padString(string, length) {
    if (string.length < length) {
        var newString = string;
        for (var i = 0; i < length - string.length; i++) {
            newString += ' ';
        }
        return newString;
    }
    return string;
}

function createBorders() {
    var borders = [];
    var first = '┌─────';
    var second = '│ Имя ';
    var last = '└─────';
    var between = '├─────';
    for (var i = 0; i < maxNameLength - 5; i++) {
        first += '─';
        second += ' ';
        between += '─';
        last += '─';
    }
    first += '┬────────────────────╥───────';
    second += '│ Телефон            ║ email ';
    between += '┼────────────────────╫───────';
    last += '┴────────────────────╨───────';
    for (var j = 0; j < maxEmailLength - 7; j++) {
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
    return formatted;
}
