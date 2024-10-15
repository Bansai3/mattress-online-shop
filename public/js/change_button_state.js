var page = window.location.toString().split('/').pop();
let button_to_change = null;
switch (page) {
  case 'bonel_spring_unit_mattresses_page':
    button_to_change = document.getElementById('bonel');
    button_to_change.classList.toggle('active_mattresses_types');
    break;
  case 'children_mattresses_page':
    button_to_change = document.getElementById('children');
    button_to_change.classList.toggle('active_mattresses_types');
    break;
  case 'independent_spring_unit_mattresses_page':
    button_to_change = document.getElementById('independent_spring');
    button_to_change.classList.toggle('active_mattresses_types');
    break;
  case 'major_league_mattresses_page':
    button_to_change = document.getElementById('major_league');
    button_to_change.classList.toggle('active_mattresses_types');
    break;
  case 'recommended_mattresses_page':
    button_to_change = document.getElementById('recommended');
    button_to_change.classList.toggle('active_mattresses_types');
    break;
  case 'springless_mattresses_page':
    button_to_change = document.getElementById('springless');
    button_to_change.classList.toggle('active_mattresses_types');
    break;
  case 'about_factory_page':
    button_to_change = document.getElementById('factory');
    button_to_change.classList.toggle('active_company_info');
    break;
  case 'info_for_customers_page':
    button_to_change = document.getElementById('customers');
    button_to_change.classList.toggle('active_company_info');
    break;
  case 'info_for_partners_page':
    button_to_change = document.getElementById('partners');
    button_to_change.classList.toggle('active_company_info');
    break;
  case 'shops_page':
    button_to_change = document.getElementById('shops');
    button_to_change.classList.toggle('active_company_info');
    break;
}
