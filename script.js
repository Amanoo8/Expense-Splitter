const BADGE_COLORS = ['#2F6B4F', '#3D5A80', '#8C5E58', '#6A7B76'];

const addMemberForm = document.querySelector("#add-member-form");
const memberNameInput = document.querySelector("#member-name-input");

let members = JSON.parse(localStorage.getItem("members")) || [];
localStorage.setItem("members", JSON.stringify(members));
document.querySelector("#members-count").textContent = `${members.length} members`;


function addMember(val) {
  let li = document.createElement("li");

  let mem = ` <span class="flex items-center justify-between py-2.5 px-1 hover:bg-slate-100/50 transition-colors gap-2">
                <div class="flex items-center gap-3 min-w-0 flex-1">
                  <span class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-medium text-white shrink-0 select-none" style="background-color: #2F6B4F;">
                    ${val.charAt(0).toUpperCase()}
                  </span>
                  <span class="font-sans text-sm font-medium text-ledger-ink truncate break-words">${val}</span>
                </div>
                <button type="button" class="remove-member-btn text-ledger-muted hover:text-ledger-rust p-2 rounded-sm transition-colors cursor-pointer shrink-0 ml-2 min-w-[36px] min-h-[36px] flex items-center justify-center" data-id="m_1" title="${val}" aria-label="Remove ${val}">
                  <svg class="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                </span>`
  li.innerHTML = mem;
  document.querySelector("#members-list").append(li);
  memberNameInput.value = "";


  let option = document.createElement("option");
  option.textContent = val;
  option.value = val;
  document.querySelector("#expense-payer-select").append(option);


  let splitDiv = document.createElement("div");
  splitDiv.innerHTML = `<label class="flex items-center gap-2.5 text-xs font-sans text-ledger-ink cursor-pointer hover:bg-slate-100/60 px-2 py-2 rounded-sm select-none border border-transparent hover:border-ledger-border transition-colors min-h-[36px]">
                  <input type="checkbox" value="${val}" class="split-member-checkbox rounded-sm text-ledger-forest accent-[#2F6B4F] cursor-pointer w-4 h-4 shrink-0" >
                  <span class="truncate break-all min-w-0">${val}</span>
                </label>`
  document.querySelector("#split-members-container").append(splitDiv);

  document.querySelectorAll('[data-id="m_1"]').forEach((query) => {
    query.addEventListener("click", (e) => {
      e.target.closest("li").remove();
      let members = JSON.parse(localStorage.getItem("members")) || [];
      members = members.filter(member => member !== query.title)
      localStorage.setItem("members", JSON.stringify(members));
      window.location.reload();
      if (expenses.length == 0) document.querySelector("#expenses-empty").classList.remove("hidden")
       if(members.length==0) document.querySelector("#balances-empty").classList.remove("hidden")
      
    })
  })
  addBalance();
  if(members.length>=2)document.querySelector("#expense-members-warning").classList.add("hidden");
}

function renderMembers(members) {
  members.forEach((member) => {
    addMember(member);
  })
}
// localStorage.clear();


addMemberForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let val = memberNameInput.value.trim();
  if (!val) return;
  let exists = members.includes(val);
  //  members.forEach((member)=>{
  //   if(JSON.stringify(member)==(val)){
  //     console.log(exists);
  //     exists=true;
  //   }
  //  })
  if (!exists) {
    addMember(val);
    addItemToArrayStorage('members', val);
    window.location.reload();
  } else {
    alert("This member name already exists!");
    memberNameInput.value = "";
    return;
  }

})
// let members=JSON.parse(localStorage.getItem('members')) || [];
renderMembers(members);
function addItemToArrayStorage(key, newItem) {
  let existingArray = JSON.parse(localStorage.getItem(key)) || [];

  existingArray.push(newItem);

  localStorage.setItem(key, JSON.stringify(existingArray));
}
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
localStorage.setItem("expenses", JSON.stringify(expenses))
document.querySelector("#add-expense-form").addEventListener("submit", (e) => {
  e.preventDefault();

  // if (!isValid) {
  //   return;
  // }

  const title = document.querySelector("#expense-title-input").value.trim();
  const amount = parseFloat(document.querySelector("#expense-amount-input").value);
  const payer = document.querySelector("#expense-payer-select").value;
  // const splitMember = [];
  // splitMembersContainer.querySelectorAll("input:checked").forEach((e) => {
  //   splitMember.push(e.value);
  // });
  let splitMember = Array.from(
    document.querySelector("#split-members-container").querySelectorAll("input:checked"),
  ).map((e) => e.value);

  expenses.push({
    id: `exp_${Date.now()}`,
    title,
    amount: amount.toFixed(2),
    payer,
    splitMember,
  });
  localStorage.setItem("expenses", JSON.stringify(expenses));
  addExpense({ id: `exp_${Date.now()}`, title, amount, splitMember, payer });
});


function addExpense({ id, title, amount, splitMember, payer }) {
  let expense = document.createElement("li");
  expense.className = "py-3 px-1 hover:bg-slate-100/50 transition-colors";
  expense.innerHTML = `<div class="flex items-start justify-between gap-3 sm:gap-4">
                  <div class="min-w-0 flex-1">
                    <div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-2">
                      <h3 class="font-sans text-sm sm:text-base font-semibold text-ledger-ink break-words min-w-0">
                        ${title}
                      </h3>
                      <div class="flex items-baseline gap-2 shrink-0 self-start sm:self-auto">
                        <span class="font-mono text-sm sm:text-base font-semibold text-ledger-ink">
                          ₹${amount}
                        </span>
                        <span class="font-mono text-xs text-ledger-muted">
                          (₹${((amount / splitMember.length).toFixed(2))} / person)
                        </span>
                      </div>
                    </div>
                    <div class="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-xs text-ledger-muted font-sans">
                      <span>Paid by <strong class="font-medium text-ledger-ink">${payer}</strong></span>
                      <span class="text-ledger-border">•</span>
                      <span>Split between: <span class="text-ledger-ink font-medium break-words">${splitMember.map((member) => member)}</span></span>
                    </div>
                  </div>
                  <button type="button" class="delete-expense-btn text-ledger-muted hover:text-ledger-rust p-2 rounded-sm transition-colors cursor-pointer shrink-0 ml-1 min-w-[36px] min-h-[36px] flex items-center justify-center" data-id="${id}" title="Delete ${title}" aria-label="Delete ${title}">
                    <svg class="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>`
  document.querySelector("#expenses-list").append(expense);

  document.querySelector("#expenses-count").textContent = `${expenses.length} expenses`

  document.querySelectorAll(".delete-expense-btn").forEach((delExp) => {
    delExp.addEventListener("click", (e) => {
      e.target.closest("li").remove();
      expenses = expenses.filter(exp => exp.id !== delExp.dataset.id)
      localStorage.setItem("expenses", JSON.stringify(expenses))
      window.location.reload();
    })
  })
  document.querySelector("#expenses-empty").classList.add("hidden")
  
addBalance();
}

function renderExpenses() {
  expenses.forEach((exp) => {
    addExpense(exp);
  })
}
renderExpenses();

document.querySelector("#clear-all-btn").addEventListener("click", () => {
  document.querySelector("#clear-all-confirm").classList.remove("hidden");
})
document.querySelector("#cancel-clear-btn").addEventListener("click", () => {
  document.querySelector("#clear-all-confirm").classList.add("hidden");
})
document.querySelector("#clear-all-confirm").addEventListener("click", () => {
  localStorage.clear();
  window.location.reload();
})

document.querySelector("#split-select-all-btn").addEventListener("click", () => {
  document.querySelectorAll(".split-member-checkbox").forEach((query) => {
    query.checked = true;
  });
})
document.querySelector("#split-clear-all-btn").addEventListener("click", () => {
  document.querySelectorAll(".split-member-checkbox").forEach((query) => {
    query.checked = false;
  });
})

if (expenses.length == 0) document.querySelector("#expenses-empty").classList.remove("hidden");
if (members.length == 0)  document.querySelector("#balances-empty").classList.remove("hidden");
if(members.length<2)document.querySelector("#expense-members-warning").classList.remove("hidden");

function addBalance(){
  document.querySelector("#balances-list").innerHTML="";
  members.map((id) => {
    let paid = 0;
    let owed = 0;
   let expenses=JSON.parse(localStorage.getItem("expenses"));
    expenses.forEach(({ amount, splitMember, payer }) => {
      const expAmount = Number(amount);
      if (payer === id) {
        paid = paid + expAmount;
      }
      if (splitMember.includes(id) && splitMember.length > 0) {
        owed = owed + expAmount / splitMember.length;
      }
    });

    let net = paid - owed;
    let statusElement = `<span class="text-ledger-muted">settled up</span>`;
    if (net > 0) {
      statusElement = `<span class="text-ledger-forest font-medium">gets back ₹${Math.abs(net).toFixed(2)}</span>`;
    } else if (net < 0) {
      statusElement = `<span class="text-ledger-rust font-medium">owes ₹${Math.abs(net).toFixed(2)}</span>`;
    }
    let BalMem = document.createElement("li");
  BalMem.className = "flex items-center justify-between py-2.5 px-1 hover:bg-slate-100/50 transition-colors gap-3"
  BalMem.innerHTML = `
                <div class="flex items-center gap-3 min-w-0 flex-1">
                  <span class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-medium text-white shrink-0 select-none" style="background-color: #2F6B4F;">
                    ${id.charAt(0).toUpperCase()}
                  </span>
                  <span class="font-sans text-sm font-medium text-ledger-ink truncate break-words">${id}</span>
                </div>
                <div class="font-mono text-sm shrink-0 ml-2 text-right">
                  ${statusElement}
                </div>`
  document.querySelector("#balances-list").append(BalMem);

  });

  document.querySelector("#balances-empty").classList.add("hidden")
}