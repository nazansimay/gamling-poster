'use strict';

const weekly = document.querySelector('#weekly');
const money = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
function updateSavings() {
  const amount = Number(weekly.value);
  document.querySelector('#weekly-value').value = money.format(amount);
  document.querySelector('#annual').textContent = money.format(amount * 52);
  weekly.setAttribute('aria-valuetext', `${money.format(amount)} per week`);
}
weekly.addEventListener('input', updateSavings);
updateSavings();

const filters = document.querySelectorAll('.filter');
const activities = document.querySelectorAll('.activity');
filters.forEach(button => button.addEventListener('click', () => {
  filters.forEach(filter => {
    const selected = filter === button;
    filter.classList.toggle('active', selected);
    filter.setAttribute('aria-pressed', String(selected));
  });
  let count = 0;
  activities.forEach(activity => {
    activity.hidden = button.dataset.filter !== 'all' && activity.dataset.category !== button.dataset.filter;
    if (!activity.hidden) count++;
  });
  document.querySelector('#filter-status').textContent = `${count} ${count === 1 ? 'idea' : 'ideas'} shown.`;
}));

const plans = {
  sport: {
    title: 'All game. No stakes.',
    intro: 'Enjoy the sport for what happens on the pitch.',
    steps: ['Pick a match to watch somewhere free, or a public space to play.', 'Invite a friend. Agree to leave betting out of the plan.', 'Bring equipment you already own, or simply take a walk and talk about the game.']
  },
  social: {
    title: 'Find your people.',
    intro: 'A good evening doesn’t need a wager.',
    steps: ['Check your student union’s calendar for a free society taster, or pick a night to meet friends.', 'Confirm any cost and booking requirements before you go.', 'Send an invite: “Free this week? Let’s try something together — no betting involved.”']
  },
  reset: {
    title: 'Take your time back.',
    intro: 'Make a little room for something that feels good.',
    steps: ['Choose one thing: a walk, a library book, or practising a skill with free resources.', 'Set aside 30 minutes and mute betting notifications.', 'Afterwards, notice how you feel. Put another session in your calendar if you enjoyed it.']
  }
};
const dialog = document.querySelector('#idea-dialog');
let currentPlan;
document.querySelectorAll('[data-idea]').forEach(button => button.addEventListener('click', () => {
  currentPlan = plans[button.dataset.idea];
  document.querySelector('#dialog-title').textContent = currentPlan.title;
  document.querySelector('#dialog-intro').textContent = currentPlan.intro;
  const steps = document.querySelector('#dialog-steps');
  steps.replaceChildren(...currentPlan.steps.map(text => {
    const item = document.createElement('li');
    item.textContent = text;
    return item;
  }));
  document.querySelector('.save-status').textContent = '';
  dialog.showModal();
}));
document.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const rect = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
});
document.querySelector('#download-plan').addEventListener('click', () => {
  if (!currentPlan) return;
  const content = `${currentPlan.title}\n\n${currentPlan.intro}\n\n${currentPlan.steps.map((step, i) => `${i + 1}. ${step}`).join('\n')}\n\nYOUR MONEY. YOUR CHOICE.\nDon’t Leave It to Chance.`;
  const url = URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'my-next-move.txt';
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  document.querySelector('.save-status').textContent = 'Your plan is ready as a text download.';
});
