
$(window).on('load', () => {

  $('.list-group-item').on('click', evt => {
    console.log(evt.target.textContent)
    $(evt.target).addClass('active');

    axios.get("http://localhost:7000/"+evt.target.textContent.trim())
      .then(({ data }) => {
        console.log(data)
        let li = null;
        data.forEach(el => {
          li = $("<li class='list-group-item'></li>").text(el.name)
        })
        $('rows').append(li)
      })
      .catch(err => console.error(err))
    
  })


}); // end load
