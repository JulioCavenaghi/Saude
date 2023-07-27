var validar = 
(    

    function()
    {
        return{

            /* */
          isNull: function(campo) 
          {

            if (campo.length === 0) {
              return true; 
            } else {
              return false;
            } 
          },

          isNumeric: function(campo) 
          {
            if (isNaN(campo)) {
              return false; 
            } else {
              return true;
            }
          },
        }
    }
);