'use strict';

var phoneBook = []; // Здесь вы храните записи как хотите -> хочу лист словарей ^^

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
        return true;
    }
    return false;
};

function isNameCorrect(name) {
    var reg = /^[a-z0-9а-я\s]+$/i;
    return reg.test(name);
}

function isEmailCorrect(email) {
    var reg = /^[-(\w|а-я).]+@([a-z0-9а-я]+[-а-яa-z0-9]+\.)+[а-яa-z0-9]{2,4}$/i;
    return reg.test(email);
}

function isPhoneCorrect(phone) {
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
                if (lowerRecord.indexOf(query) != -1) {
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
    var info = '';
    var keys = Object.keys(record);
    for (var i = 0; i < keys.length; i++) {
        info += record[keys[i]] + ', ';
    }
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
    var records = data.split('\r\n');
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
    console.log('┌─────────────┬────────────────────╥──────────────────┐');
    console.log('│ Имя         │ Телефон            ║ email            │');
    for (var i = 0; i < phoneBook.length; i++) {
        console.log('├─────────────┼────────────────────╫──────────────────┤');
        var record = createBetter(phoneBook[i]);
        console.log('│' + record[0] + '│' + record[1] + '║' + record[2] + '│');
    }
    console.log('└─────────────┴────────────────────╨──────────────────┘' + '\n');
};

function createBetter(record) {
    var newRecord = [];
    if (record.name.length < 13) {
        var newName = record.name;
        for (var i = 0; i < 13 - record.name.length; i++) {
            newName += ' ';
        }
        newRecord.push(newName);
    } else {
        newRecord.push(record.name);
    }
    newRecord.push(updatePhone(record.phone));
    if (record.email.length < 18) {
        var newEmail = record.email;
        for (var i = 0; i < 18 - record.email.length; i++) {
            newEmail += ' ';
        }
        newRecord.push(newEmail);
    } else {
        newRecord.push(record.email);
    }
    return newRecord;
}

function updatePhone(phone) {
    var re = /\d{1}/g;
    var newPhone = '';
    var count = 0;
    phone = phone.match(re).join('');
    for (var i = phone.length - 1; i >= 0; i--) {
        newPhone += phone[i];
        count++;
        if (count === 3 || count === 4) {
            newPhone += '-';
        }
        if (count === 7) {
            newPhone += ' )';
        }
        if (count === 10) {
            newPhone += '( ';
        }
    }
    if (newPhone.length === 16) {
        newPhone += '7';
    }
    newPhone += '+';
    newPhone = newPhone.split('').reverse().join('');
    return newPhone + '  ';
}
