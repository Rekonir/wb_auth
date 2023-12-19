
// Data Transfer Object (DTO) — один из шаблонов проектирования, используется для 
// передачи данных между подсистемами приложения.
module.exports = class UserDTO{
    email;
    id;
    isActivated;

    constructor(model){
        this.email = model.email;
        this.id=model._id;
        this.isActivated = model.isActivated
    }
}


//  В "классическом" понимании DTO являются простыми объектами (без логики), 
// описывающими структуры данных, передаваемых "по проводам" между разнесенными 
// процессами (remote processes). Зачастую данные "по проводам" передаются в виде JSON.