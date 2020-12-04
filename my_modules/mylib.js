class MyLib {

  //Возвращает текущую дату
  static NowDate() {
    let now = new Date()
    return now.getHours()+":"+now.getMinutes()+":"+now.getSeconds()+" "+now.getDate()+":"+now.getMonth()+":"+now.getFullYear();
  }
}

module.exports = MyLib;
