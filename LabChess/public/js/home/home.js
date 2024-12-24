// setTimeout(function() {
//     window.location.reload();
// }, 20000); 


window.onload = function() {
    if (!localStorage.getItem('modalShown')) {
      var modal = new bootstrap.Modal(document.getElementById('infoModal'));
      modal.show();
      
      localStorage.setItem('modalShown', 'true');
    }
  };