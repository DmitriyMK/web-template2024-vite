// Tabs
const tabClick = ({ target }) => {
  const { dataset: { id = '' }} = target;

  document.querySelectorAll('.sidebar__tab li').forEach(t => t.classList.remove('selected'));
  target.classList.add('selected');

  // target.parentElement.parentElement.classList.add(`${target.dataset.id}-selected`);

  document.querySelectorAll('.sidebar__tabs-panel').forEach(t => t.classList.add('hidden'));
  document.querySelector(`#${id}`).classList.remove('hidden');
};

const bindTabs = () => {
  document.querySelectorAll('.sidebar__tab li').forEach(tab => {
    tab.addEventListener('click', tabClick);
  })
};

export { bindTabs} ;
