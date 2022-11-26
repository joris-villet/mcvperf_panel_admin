// import { render, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';

$(window).on('load', () => {

  let data_result = [];
  let tableClicked = "";
  let dataLength = 0;
  let page = 1;
  let offset = 0;
  let rowClicked = "";
  let lastIdRow = "";
  //let currentPage = 1;
  

  // $('.list-group-item').on('click', getData);
  $('.list-group-item').on('click', evt => {
    if (evt.target.textContent.trim() !== tableClicked) {
      offset = 0;
    }
    tableClicked = evt.target.textContent.trim();
    console.log(tableClicked)
    //currentPage = window.location.pathname.split('/').at(-1);
    // currentPage = currentPage === "admin" ? 0 : currentPage;
    window.history.pushState({}, '', `/admin/${tableClicked}`);
    getData();
  });

  // ALL TABLES
  function getData() {
 
    // console.log(evt.target.textContent)
    // tableClicked = evt.target.textContent.trim();
    // $(evt.target).addClass('active');

    // axios.get(`http://localhost:7000/${tableClicked}/${offset}`)
    axios.get(`http://localhost:7000/admin/${tableClicked}/${offset}`)
      .then(({ data }) => {
        //console.log(data)
        data_result = [];
        data_result.push(...data.result);
        dataLength = Number(data.length);
      
        createTable(tableClicked);
        createPagination();

        $(".edit").on('click', openSidebarEdit);
        $('.close-sidebar').on('click', closeSidebarEdit);

        let id = [];
        $('.rows tr th').each((i, el) => id.push(Number(el.textContent)))
        lastIdRow = id.at(-1)

      })
      .catch(err => console.error(err));
    
  };

  function closeSidebarEdit() {
    $('.sidebar_edit').css('right', '-400px');
  }

  function openSidebarEdit(evt) {
    $('.sidebar_edit').css('right', '0px');
    editTable(evt);
  }

 

  function editTable(evt) {

    $('.form-content').text("");

    const data = data_result.filter(el => el.id === Number(evt.target.id));
    //console.log("row clicked => ", data)
    rowClicked = data;

    for (const [key, value] of Object.entries(...data)) {
      //console.log(`key: ${key}: value ${value}`)
      let div = document.createElement('div');
      div.classList.add('w-full')
  
      let label = document.createElement('label');
      label.textContent = key;
      label.classList.add('w-full', 'font-bold')
      let input = document.createElement('input');
      input.setAttribute('id', key);
      input.setAttribute('value', value);
      input.classList.add('input-edit');
      label.appendChild(input);
      div.appendChild(label);

      if (key == 'id' || key == 'created_at' || key == 'updated_at') {
        input.setAttribute('disabled', true);
      }

      //$('.form').append(div);
      $('.form-content').append(div);
    }
    
    //$('.form').append('<button class="btn-editer">Editer</button>');

    updateTable();
  };


  function updateTable() {

    $('.btn-editer').on('click', evt => {
      evt.preventDefault();

      const payload = {};
      let id = undefined;
      
      $(".form-content input").each((i, el) => {
        payload[el.id] = el.value;
        id = payload['id'];
      })

      // //console.log(rowClicked)
      // //console.log("payload => ", payload)
      // // ici comparer les deux tableau
      // let arr = [];
      // for (const [key, value] of Object.entries(...rowClicked)) {
      //   for (const [key2, value2] of Object.entries(payload)) {
      //     key == key2 && value != value2 ? arr.push(value2) : null;
      //   }
      // }
      
      // // clear modal body
      // $('#modal-body').empty();

      // $('.modal-title').html(`<h2>Table ${tableClicked}</h2>`)
      // let h3 = $('<h3>Es-tu sûr de modifier: </h3>');
      // $('#modal-body').append(h3);

      // for (let i = 0; i < arr.length; i++) {
      //   let p = $('<span></span><hr>');
      //   p.text(`${arr[i]}`);
      //   $('#modal-body').append(p);
      // }
      
      // $('#btn-close').on('click', evt => {
      //   return;
      // })
      

      // console.log("click btn save")
      //console.log("id => ", id)

      // axios.put(`http://localhost:7000/brands/update/${id}`, payload)
      //   .then(({ data }) => console.log("updated"))
      //   .catch(err => console.log(err));
      axios.put(`http://localhost:7000/${tableClicked}/update/${id}`, payload)
        .then(({ data }) => console.log(data))
        .catch(err => console.log(err));
      
      closeSidebarEdit();
      getData();


    })
  }


function createTable(table) {

  //clear table
  $('.thead').empty();
  $('.rows').empty();

  const stage = (table === 'power_essences' || table === 'power_diesels');
  
  if (stage) {
    const thead = $('<tr></tr>')
      .append(`<th scope="row">Id</th>`)
      .append(`<td>puissance origine</td>`)
      .append(`<td>puissance stage</td>`)
      .append(`<td>couple origine</td>`)
      .append(`<td>couple stage</td>`)
      .append(`<td>prix</td>`)
    
      $('.thead').append(thead);
  }
  else {
    let thead = $('<tr></tr>')
      .append(`<th scope="row">Id</th>`)
      .append(`<th scope="row">Name</th>`)
        
    $('.thead').append(thead);
  }
    
    data_result.forEach((el, i) => {
      
      let index = 0;
      
      if (stage) {

        if (index !== i) {
          const thead = $('<tr></tr>')
            .append(`<th scope="row">${el.id}</th>`)
            .append(`<td>${el.puissance_ori}</td>`)
            .append(`<td>${el.puissance_stage}</td>`)
            .append(`<td>${el.couple_ori}</td>`)
            .append(`<td>${el.puissance_stage}</td>`)
            .append(`<td>${el.price}</td>`)
            .append(`<button id="${el.id}" class="edit"></button>`);

          let svgEdit = $('<svg width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M3 6v2h11V6H3m0 4v2h11v-2H3m17 .1c-.1 0-.3.1-.4.2l-1 1l2.1 2.1l1-1c.2-.2.2-.6 0-.8l-1.3-1.3c-.1-.1-.2-.2-.4-.2m-1.9 1.8l-6.1 6V20h2.1l6.1-6.1l-2.1-2M3 14v2h7v-2H3Z"/></svg>')
          $('.table .rows button').append(svgEdit);
        
          
          $('.thead').append(thead);
        }
        else {
          const thead = $('<tr></tr>')
            .append(`<th scope="row">${el.id}</th>`)
            .append(`<td>${el.puissance_ori}</td>`)
            .append(`<td>${el.puissance_stage}</td>`)
            .append(`<td>${el.couple_ori}</td>`)
            .append(`<td>${el.puissance_stage}</td>`)
            .append(`<td>${el.price}</td>`)
            .append(`
              <button id="${el.id}" class="edit">
                <svg width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M3 6v2h11V6H3m0 4v2h11v-2H3m17 .1c-.1 0-.3.1-.4.2l-1 1l2.1 2.1l1-1c.2-.2.2-.6 0-.8l-1.3-1.3c-.1-.1-.2-.2-.4-.2m-1.9 1.8l-6.1 6V20h2.1l6.1-6.1l-2.1-2M3 14v2h7v-2H3Z"/></svg>
              </button>
            `);
          
          // let svgEdit = $('<svg width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M3 6v2h11V6H3m0 4v2h11v-2H3m17 .1c-.1 0-.3.1-.4.2l-1 1l2.1 2.1l1-1c.2-.2.2-.6 0-.8l-1.3-1.3c-.1-.1-.2-.2-.4-.2m-1.9 1.8l-6.1 6V20h2.1l6.1-6.1l-2.1-2M3 14v2h7v-2H3Z"/></svg>')
          // $('.table .rows tr button').append(svgEdit);
          
            $('.thead').append(thead);
        }

      }
      else {
        if (index !== i) {
  
          let tr = $('<tr></tr>')
            .append(`<th scope="row">${el.id}</th>`)
            .append(`<td>${el.name}</td>`)
            .append(`<button id="${el.id}" class="edit">edit</button>`)
          
          $('.rows').append(tr);
        }
        else {
  
          let tr = $('<tr></tr>')
            .append(`<th scope="row">${el.id}</th>`)
            .append(`<td>${el.name}</td>`)
            .append(`<button id="${el.id}" class="edit">edit</button>`)
          
          $('.rows').append(tr);
        }
      }

    })
  };


  function createPagination() {

    //const numberPages = Math.round(Number(dataLength) / 20);

    $('.pagination').empty();
    
    // for (let i = 1; i <= numberPages; i++) {
    //   let li = $(`<li class="page-item page-link btn-pages">${i}</li>`);
    //   $('.pagination').append(li);
    // }

    let btnPrevious = $(`<li class="page-item page-link btn-pages">previous</li>`);
    let btnNext = $(`<li class="page-item page-link btn-pages">next</li>`);
    //let rowsLength = $(`<span>${dataLength}</span>`);
    $('.pagination').append(btnPrevious);
    $('.pagination').append(btnNext);
    $('.count-rows').text(`Résultats: ${dataLength}`);

    clickPagination();
  };
  
  
  function clickPagination() {
    $('.btn-pages').on('click', evt => {
      let pageAsked = evt.target.textContent;
     
      console.log(pageAsked);
      //console.log("dernière id => ", typeof dataLength)
      
      if (pageAsked === "next") {
        console.log(lastIdRow === dataLength)
        if (lastIdRow === dataLength) return;
        offset = data_result.at(-1).id;
      }
      if (pageAsked === "previous") {
        if (offset === 0) return;
        offset = data_result[0].id - 1 - 20;
      }
      getData();
      
      // window.history.pushState({}, '', `/admin/${tableClicked}/${pageAsked}`);
      // currentPage = window.location.pathname.split('/').at(-1);
      //getData();
      // if (pageAsked === 1) {
      //   window.history.pushState({}, '', `/admin/${tableClicked}/1`);
      //   getData();
      // };

      // if (pageAsked > page) {
      //   window.history.pushState({}, '', `/admin/${tableClicked}/${page++}`);
      //   getData();
      // }
      // if (pageAsked < page) {
      //   window.history.pushState({}, '', `/admin/${tableClicked}/${page--}`);
      //   getData();
      // }
    })
  }
  


}); // end load
