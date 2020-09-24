var config = {
  apiKey: "AIzaSyD_WU0FpGbPi7oRfzSo0R2YrIjSo_73CXI",
  authDomain: "todolistapp-e1b24.firebaseapp.com",
  databaseURL: "https://todolistapp-e1b24.firebaseio.com",
  projectId: "todolistapp-e1b24",
  storageBucket: "todolistapp-e1b24.appspot.com",
  messagingSenderId: "1045036153545",
  appId: "1:1045036153545:web:147ea429fe903fb374ab18",
  measurementId: "G-FSM7WB88J7"
};

firebase.initializeApp(config);
var user = firebase.auth().signInAnonymously();

    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        // User is signed in.
        var isAnonymous = user.isAnonymous;
        user_id = user.uid;
      } else {
        // User is signed out.
        console.log("ABC");
      }
      console.log("onAuthStateChanged");

    });
var db = firebase.database();

// CREATE REWIEW

var reviewForm = document.getElementById('reviewForm');
var titlePost   = document.getElementById('titlePost');
var description    = document.getElementById('description');
var hiddenId   = document.getElementById('hiddenId');

reviewForm.addEventListener('submit', (e) => {
  e.preventDefault();

  if (!titlePost.value || !description.value) return null

  var id = hiddenId.value || Date.now()

  db.ref('posts/' + id).set({
    titlePost: titlePost.value,
    description: description.value
  });

  titlePost.value = '';
  description.value  = '';
  hiddenId.value = '';
});

// READ REVEIWS

var posts = document.getElementById('posts');
var reviewsRef = db.ref('/posts');

reviewsRef.on('child_added', (data) => {
  var li = document.createElement('tr')
  li.id = data.key;
  li.innerHTML = reviewTemplate(data.val())
  posts.appendChild(li);
});

reviewsRef.on('child_changed', (data) => {
  var reviewNode = document.getElementById(data.key);
  reviewNode.innerHTML = reviewTemplate(data.val());
});

reviewsRef.on('child_removed', (data) => {
  var reviewNode = document.getElementById(data.key);
  reviewNode.parentNode.removeChild(reviewNode);
});

posts.addEventListener('click', (e) => {
  var reviewNode = e.target.parentNode

  // UPDATE REVEIW
  if (e.target.classList.contains('edit')) {
    titlePost.value = reviewNode.querySelector('.titlePost').innerText;
    description.value  = reviewNode.querySelector('.description').innerText;
    hiddenId.value = reviewNode.id;
  }

  // DELETE REVEIW
  if (e.target.classList.contains('delete')) {
    var id = reviewNode.id;
    db.ref('posts/' + id).remove();
  }
});

function reviewTemplate({titlePost, description}) {
  return `
    <div class='titlePost'>${titlePost}</div>
    <div class='description'>${description}</div>
    <button class='delete'>Delete</button>
    <button class='edit'>Edit</button>
  `
};
