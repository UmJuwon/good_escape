Function.prototype.member = function(name, value){
	this.prototype[name] = value
} // 기본함수의 프로토타입

////////  게임 선언
function Game(){}
Game.start = function(room, welcome){ // 시작
	game.start(room.id)
	printMessage(welcome)
}
Game.end = function(){  // 종료
	game.clear()
}
Game.move = function(room){  // 이동
	game.move(room.id)	
}
Game.handItem = function(){
	return game.getHandItem()
}



//////// 방 선언
function Room(name, background){
	this.name = name
	this.background = background
	this.id = game.createRoom(name, background)
}
Room.member('setRoomLight', function(intensity){  // 방 밝기
	this.id.setRoomLight(intensity) 
})

//////// 객체 선언

function Object(room, name, image){
	this.room = room
	this.name = name
	this.image = image

	if (room !== undefined){
		this.id = room.id.createObject(name, image)
	}
}

Object.STATUS = { OPENED: 0, CLOSED: 1, LOCKED: 2 }

Object.member('setSprite', function(image){
	this.image = image
	this.id.setSprite(image)
})
Object.member('resize', function(width){  // 물체 크기 정하기
	this.id.setWidth(width)
})
Object.member('setDescription', function(description){
	this.id.setItemDescription(description)
})

Object.member('getX', function(){
	return this.id.getX()
})
Object.member('getY', function(){
	return this.id.getY()
})
Object.member('locate', function(x, y){  // 물체 위치 지정
	this.room.id.locateObject(this.id, x, y)
})
Object.member('move', function(x, y){	// 이동할 때
	this.id.moveX(x)
	this.id.moveY(y)
})

Object.member('show', function(){  // 보이기
	this.id.show()
})
Object.member('hide', function(){  // 숨기기
	this.id.hide()
})
Object.member('open', function(){  // 열림
	this.id.open()
})
Object.member('close', function(){  // 닫힘
	this.id.close()
})
Object.member('lock', function(){  // 잠김
	this.id.lock()
})
Object.member('unlock', function(){  // 잠기지 않음
	this.id.unlock()
})
Object.member('isOpened', function(){  // 열려있는 상태
	return this.id.isOpened()
})
Object.member('isClosed', function(){  // 닫혀있는 상태
	return this.id.isClosed()
})
Object.member('isLocked', function(){  // 잠겨있는상태
	return this.id.isLocked()
})
Object.member('pick', function(){ 
	this.id.pick()
})
Object.member('isPicked', function(){ 
	return this.id.isPicked()
})

//////// 문 선언
function Door(room, name, closedImage, openedImage, connectedTo){
	Object.call(this, room, name, closedImage)

	// Door properties
	this.closedImage = closedImage
	this.openedImage = openedImage
	this.connectedTo = connectedTo
}

// 객체 상속
Door.prototype = new Object()

Door.member('onClick', function(){ // door를 click했을 때
	if (!this.id.isLocked() && this.id.isClosed()){  // door가 잠기지 않았고 닫힌 상태라면
		this.id.open()  // open 상태로 바꿈
	}
	else if (this.id.isOpened()){  // door가 열려진 상태라면
		if (this.connectedTo !== undefined){
			Game.move(this.connectedTo)  // 이동
		}
		else {
			Game.end()  // 게임 종료
		}
	}
})

Door.member('onOpen', function(){
	this.id.setSprite(this.openedImage)
})
Door.member('onClose', function(){
	this.id.setSprite(this.closedImage)
})


//////// 키패드 선언
function Keypad(room, name, image, password, callback){
	Object.call(this, room, name, image)

	// Keypad properties
	this.password = password
	this.callback = callback
}
// 객체 상속
Keypad.prototype = new Object()

Keypad.member('onClick', function(){
	showKeypad('number', this.password, this.callback)
})


//////// 도어락 선언
function DoorLock(room, name, image, password, door, message){
	Keypad.call(this, room, name, image, password, function(){
		printMessage(message)
		door.unlock()
	})
}

// 객체 상속 (도어락-키패드)
DoorLock.prototype = new Keypad()


/////// 아이템 선언
function Item(room, name, image){
	Object.call(this, room, name, image)
}

// 객체 상속
Item.prototype = new Object()

Item.member('onClick', function(){
	this.id.pick()
})
Item.member('isHanded', function(){
	return Game.handItem() == this.id
})

// 방 내부 소품 선언  
function Tool(room, name, image){
	Object.call(this, room, name, image) 
}

// 객체 상속   
Tool.prototype = new Object()




room1 = new Room('room1', '홈즈배경1.png')	// 변수명과 이름이 일치해야 한다.
room2 = new Room('room2', '사건현장.png')		
room3 = new Room('room3', '배경-3.png')
room4 = new Room('room4', '배경-4.png')
room5 = new Room('room5', '마지막방.png')		

room1.door1 = new Door(room1, 'door1', '침대-1.png', '침대열림.png', room2)
room1.door1.resize(450)
room1.door1.locate(950, 412)
room1.door1.lock()

room1.keypad1 = new Keypad(room1, 'keypad1', '숫자키-우.png', '3852', function(){
	printMessage('매트리스가 올라가면서 지하로 향하는 통로가 드러났다')
	if (room1.door1.unlock()){  
		room1.door1.open()  // open 상태로 바꿈
	}
	else if (room1.door1.isOpened()){  // door1이 열려진 상태라면
		if (door1.connectedTo !== undefined){
			Game.move(door1.connectedTo)  // 이동
		}
		else {
			Game.end()
		}
	}	
})

room1.keypad1.resize(40)
room1.keypad1.locate(920, 250)

room1.keypad1.onClick = function(){	
	printMessage('조금만 검색해보면 알 수 있어')
	showKeypad('number', this.password, this.callback)
}


room1.key1 = new Item(room1, 'key1', '열쇠.png')
room1.key1.resize(45)
room1.key1.locate(745, 500)

room1.door4 = new Door(room1, 'door4', '문2-좌-닫힘.png', '문2-좌-열림.png', room4)
room1.door4.resize(100)
room1.door4.locate(400, 280)

room1.door4.onClick = function(){
	if (room1.key1.isHanded() && !this.id.isLocked() && this.id.isClosed()){
		printMessage('기분나쁜 삐걱거림과 함께 문이 열렸다') 
		this.id.open()
	}
	else if (this.id.isOpened()){
		if (this.connectedTo !== undefined){
			Game.move(this.connectedTo)
		}
		else {
			Game.end()
		}
	}

}


room4.door4 = new Door(room4, 'door4', '문2-우-닫힘.png', '문2-우-열림', room1)  
room4.door4.resize(100)
room4.door4.locate(900, 320)


room4.TV = new Tool(room4, 'TV', 'TV2-1.png') 
room4.TV.resize(200)

room4.TV.locate(560, 270)

room4.TV.onClick = function() {

	showVideoPlayer("끼룩.wmv") // 비디오 재생
}


room4.hidden = new Tool(room4, 'hidden', '히든메세지.png') 
room4.hidden.resize(270)
room4.hidden.locate(100, 200)

room4.hidden.onClick = function() {

	printMessage("안녕하세요")
}



room4.hidden1 = new Tool(room4, 'hidden1', '히든메세지.png') 
room4.hidden1.resize(270)
room4.hidden1.locate(100, 100)

room4.hidden1.onClick = function() {

	printMessage("셜록홈즈의 테마로 게임을 구성해보았습니다")
}



room4.hidden2 = new Tool(room4, 'hidden2', '히든메세지1.png') 
room4.hidden2.resize(270)
room4.hidden2.locate(700, 200)

room4.hidden2.onClick = function() {

	printMessage("이 메세지를 발견하신 분은")
}



room4.hidden3 = new Tool(room4, 'hidden3', '히든메세지1.png') 
room4.hidden3.resize(270)
room4.hidden3.locate(700, 100)

room4.hidden3.onClick = function() {

	printMessage("관찰력이 좋네요")
}




room4.hidden4 = new Tool(room4, 'hidden4', '히든메세지1.png') 
room4.hidden4.resize(270)
room4.hidden4.locate(900, 100)

room4.hidden4.onClick = function() {

	printMessage("동영상을 주의깊게 보세요")
}




room1.book = new Tool(room1, 'book', '책장-좌1.png') 
room1.book.resize(270)
room1.book.locate(100, 350)

room1.book.onClick = function() {

	printMessage("책장에서 낡은 종이를 발견했다!")
	showImageViewer("종이-1.png") // 이미지 출력
}




room1.phone = new Tool(room1, 'phone', '전화기-오른쪽.png') 
room1.phone.resize(30)
room1.phone.locate(830, 250)

room1.phone.onClick = function() {

	playSound("alarm.wav") // 오디오 재생

}


room1.table = new Tool(room1, 'table', '테이블3-2.png')

room1.table.resize(300)

room1.table.locate(550, 600)
room1.table.onClick = function() {

	printMessage("평범한 테이블이다")
}






room2.door1 = new Door(room2, 'door1', '구멍문.png', '구멍문.png', room1) 
room2.door1.resize(270)
room2.door1.locate(300, 70)

room2.door2 = new Door(room2, 'door2', '문-우-닫힘.png', '문-우-열림.png', room3)
room2.door2.resize(100)
room2.door2.locate(1200, 410)
room2.door2.hide()

room2.keypad2 = new Keypad(room2, 'keypad2', 'cryptex.png', '1820', function(){
	printMessage('천장에서 문이 내려왔다')
	room2.door2.show()
})
room2.keypad2.resize(40)
room2.keypad2.locate(920, 250)

room2.keypad2.onClick = function(){
	printMessage('악마의 재능')
	showKeypad('number', this.password, this.callback)
}



room2.vio = new Tool(room2, 'vio', '바이올린.png')

room2.vio.resize(100)

room2.vio.locate(550, 600)
room2.vio.onClick = function() {

	printMessage("잘 손질된 바이올린이다")
	showAudioPlayer("파가니니.wav") // 플레이어
}



room2.note = new Tool(room2, 'note', '노트.png') 
room2.note.resize(170)
room2.note.locate(200, 650)

room2.note.onClick = function() {

	printMessage("누군가 나에게 남긴 메세지인 듯 하다")
	showImageViewer("쪽지.png") // 이미지 출력
}





room3.door1 = new Door(room3, 'door1', '문-왼쪽-닫힘.png', '문-왼쪽-열림.png', room2)
room3.door1.resize(120)
room3.door1.locate(300, 297)

room3.door2 = new Door(room3, 'door2', '문-오른쪽-닫힘.png', '문-오른쪽-열림.png', room5)
room3.door2.resize(120)
room3.door2.locate(1000, 313)
room3.door2.lock()

room3.lock1 = new DoorLock(room3, 'lock1', '키패드-우.png', '6765', room3.door2, '끼익☆')
room3.lock1.resize(20)
room3.lock1.locate(920, 250)


room3.rabbit = new Tool(room3, 'rabbit', '토끼.png')
room3.rabbit.resize(100)

room3.rabbit.locate(450, 400)
room3.rabbit.hide()
room3.rabbit.onClick = function() {

	printMessage("토끼는 죽지않아")
}

room3.box = new Tool(room3, 'box', '상자3-닫힘.png')
room3.box.resize(100)

room3.box.locate(550, 400)
room3.box.onClick = function() {

	room3.rabbit.show()
}


room3.b = new Tool(room3, 'b', '책.png') 
room3.b.resize(170)
room3.b.locate(100, 550)

room3.b.onClick = function() {

	printMessage("단서가 적혀있다")
	showImageViewer("쪽지1.png") // 이미지 출력
}



room5.door5 = new Door(room5, 'door5', '스탠드.png', '스탠드.png', room3)
room5.door5.resize(80)
room5.door5.locate(350, 500)


room5.door6 = new Door(room5, 'door6', '창문닫힘.png', '창문열림.png')
room5.door6.resize(200)
room5.door6.locate(650, 412)
room5.door6.lock()
	


room5.p = new Tool(room5, 'p', '포스트잇.png')
room5.p.resize(40)

room5.p.locate(450, 600)
room5.p.onClick = function() {

	printMessage("초심으로 돌아가서 빈 공간을 눈여겨 보세요. 몇 번 [끼룩]거릴까요?")
}


room5.keypad3 = new DoorLock(room5, 'keypad3', '맥-우.png', '0004', room5.door6, '드디어...')
room5.keypad3.resize(70)
room5.keypad3.locate(920, 550)


Game.start(room1, '내 이름은 홈즈, 탐정이죠.')
