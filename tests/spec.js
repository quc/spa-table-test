describe('SPA Table', function() {

  it('should have a title', function() {
    browser.get('http://127.0.0.1:1337');

    expect(browser.getTitle()).toEqual('SPA Table Test');
  });

  /* Table */
  var headers = element.all(by.repeater('header in tableHeaders'));
  var contacts = element.all(by.repeater('contact in contacts'));
  var inputs = element.all(by.css('.checkContact'));
  var labels = element.all(by.css('label[for^=checkContact]'));
  var popup = element.all(by.css('td.contact-action'));
  var contactsEdit = element.all(by.model('contact.edit'));
  var addNew = element.all(by.css('button[name="newContact"]')).first();

  /* Form */
  var formWrapper = element.all(by.css('.form-container')).first();
  var firstName = element(by.model('inputs.firstName'));
  var lastName = element(by.model('inputs.lastName'));
  var phone = element(by.model('inputs.phone'));
  var gender = element.all(by.model('inputs.gender'));
  var age = element(by.model('inputs.age'));
  var submit = element.all(by.css('button[type="submit"]')).first();
  var reset = element.all(by.css('button[name="reset"]')).first();
  var close = element.all(by.css('button[name="cancel"]')).first();


  it('should not contain repeated IDs', function() {
    var allIDs = element.all(by.css('*[id]'))
        .map(function(el, i, arr){
          return el.getAttribute('id');
        });
    var isIdRepeated = allIDs.then(function(val) {
          return val.some(function(el, i, arr){
            return arr.indexOf(el,i+1) !== -1;
          });
        });

    expect(isIdRepeated).toBe(false);
  });

  var orderIcon = ' keyboard_arrow_down';
  var reverveOrderIcon = ' keyboard_arrow_up';

  it('should render initial contacts data set', function() {
    expect(contacts.count()).toBe(3);
  });

  it('should render headers from "tableHeaders"', function() {
    expect(headers.count()).toBe(5);
    expect(headers.get(0).getText()).toEqual('First Name' + orderIcon);
    expect(headers.get(1).getText()).toEqual('Last Name');
    expect(headers.get(2).getText()).toEqual('Phone');
    expect(headers.get(3).getText()).toEqual('Gender');
    expect(headers.get(4).getText()).toEqual('Age');
  });

  it('should on click change order', function() {
    var contacts = element.all(by.repeater('contact in contacts')
        .row(0).column('contact[title.type]'));

    expect(headers.get(0).getText()).toEqual('First Name' + orderIcon);
    expect(contacts.get(0).getText()).toEqual('Bob');
    headers.get(0).click();
    expect(headers.get(0).getText()).toEqual('First Name' + reverveOrderIcon);
    expect(contacts.get(0).getText()).toEqual('Stan');
    headers.get(0).click();
    expect(headers.get(0).getText()).toEqual('First Name' + orderIcon);
    expect(contacts.get(0).getText()).toEqual('Bob');
  });

  it('should on click set new order type and set default order', function() {
    var contacts = element.all(by.repeater('contact in contacts')
        .row(0).column('contact[title.type]'));

    expect(headers.get(1).getText()).toEqual('Last Name');
    expect(contacts.get(1).getText()).toEqual('Dylan');
    headers.get(1).click();
    expect(headers.get(1).getText()).toEqual('Last Name' + orderIcon);
    expect(contacts.get(1).getText()).toEqual('Dup');
  });

  it('should set unique id for input', function() {
    inputs.count().then(function(count) {
      expect(count).toBe(3);
      expect(inputs.get(0).getAttribute('id')).toEqual('checkContact0');
      expect(inputs.last().getAttribute('id')).toEqual('checkContact' + (count - 1));
      return count;
    });
  });

  it('should on click "more action" open more-action-popup', function() {
    expect(popup.get(0).isDisplayed()).toBe(false);
    expect(inputs.get(0).isDisplayed()).toBe(false);
    expect(inputs.get(0).isSelected()).toBe(false);
    labels.get(0).click();
    expect(inputs.get(0).isSelected()).toBe(true);
    expect(popup.get(0).isDisplayed()).toBe(true);
  });

  it('should on click "edit" open form popup with data', function() {
    expect(formWrapper.isDisplayed()).toBe(false);
    contactsEdit.get(0).click();
    expect(formWrapper.isDisplayed()).toBe(true);

    expect(firstName.getAttribute('value')).toEqual('Stan');
    expect(lastName.getAttribute('value')).toEqual('Dup');
    expect(phone.getAttribute('value')).toEqual('0666666666');
    expect(gender.get(0).getAttribute('value')).toEqual('male');
    expect(age.getAttribute('value')).toEqual('42');
  });

  it('should on input change value', function() {
    firstName.sendKeys('islav');
    expect(firstName.getAttribute('value')).toEqual('Stanislav');
    firstName.clear();
  });

  it('should on wrong input show warning message', function() {
    firstName.sendKeys('Stanislav');

    expect(element.all(by.css('.warn-msg')).get(0).isDisplayed()).toBe(false);
    firstName.sendKeys('-');
    expect(element.all(by.css('.warn-msg')).get(0).isDisplayed()).toBe(true);
    expect(firstName.getAttribute('class')).toContain('warn');
    firstName.sendKeys('Junior');
    expect(element.all(by.css('.warn-msg')).get(0).isDisplayed()).toBe(false);
    expect(firstName.getAttribute('class')).not.toContain('warn');
    firstName.clear();
  });

  it('should disable save button when error message occurs', function() {
    firstName.sendKeys('Stanislav45');
    expect(submit.isEnabled()).toBe(false);

    firstName.clear();
  });

  it('should on form save update value in the table and close form', function() {
    var contacts = element.all(by.repeater('contact in contacts')
        .row(0).column('contact[title.type]'));

    firstName.sendKeys('Stanislav');
    submit.click();
    expect(formWrapper.isDisplayed()).toBe(false);
    expect(contacts.get(0).getText()).toEqual('Stanislav');
  });

  it('should reset form data', function() {
    expect(popup.get(0).isDisplayed()).toBe(false);
    labels.get(0).click();
    expect(popup.get(0).isDisplayed()).toBe(true);

    expect(formWrapper.isDisplayed()).toBe(false);
    contactsEdit.get(0).click();
    expect(formWrapper.isDisplayed()).toBe(true);

    reset.click();

    expect(firstName.getAttribute('value')).toBe('');
    expect(lastName.getAttribute('value')).toBe('');
    expect(phone.getAttribute('value')).toBe('');
    expect(gender.get(0).getAttribute('checked')).toBeFalsy();
    expect(gender.get(1).getAttribute('checked')).toBeFalsy();
    expect(age.getAttribute('value')).toBe('');
  });

  it('should close form', function() {
    expect(formWrapper.isDisplayed()).toBe(true);
    close.click();
    expect(formWrapper.isDisplayed()).toBe(false);
  });

  it('should open empty form', function() {
    expect(formWrapper.isDisplayed()).toBe(false);
    addNew.click();
    expect(formWrapper.isDisplayed()).toBe(true);

    expect(firstName.getAttribute('value')).toBe('');
    expect(lastName.getAttribute('value')).toBe('');
    expect(phone.getAttribute('value')).toBe('');
    expect(gender.get(0).getAttribute('checked')).toBeFalsy();
    expect(gender.get(1).getAttribute('checked')).toBeFalsy();
    expect(age.getAttribute('value')).toBe('');
  });

  it('should create new contact', function() {
    firstName.sendKeys('Don');
    lastName.sendKeys('Quixote');
    phone.sendKeys('0987654321');
    element(by.css('label[for=male]')).click();
    age.sendKeys('50');

    expect(submit.isEnabled()).toBeTruthy();
    submit.click();

    expect(contacts.count()).toBe(4);
  });
});
