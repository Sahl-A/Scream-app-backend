const db = {
  users: [
    {
      _id: "345df345#%#",
      email: "test@test.com",
      handle: "test",
      createdAt: "timeStamp",
      imageUrl: "images/personal-photo.jpg",
      bio: "this is my bio",
      website: "test.com",
      location: "EG, Cairo",
    },
    {
      _id: "345df345#%#",
      email: "test@test.com",
      handle: "test",
      createdAt: "timeStamp",
      imageUrl: "images/personal-photo.jpg",
      bio: "this is my bio",
      website: "test.com",
      location: "EG, Cairo",
    },
  ],
  screams: [
    {
      userHandle: "test",
      body: "this is my post",
      createdAt: "time stamp",
      likeCount: "63",
      commentCount: "12",
    },
    {
      userHandle: "test",
      body: "this is my post",
      createdAt: "time stamp",
      likeCount: "63",
      commentCount: "12",
    },
  ],
  comments: [
    {
      userHandle: "test 1",
      scremId: "345*Gsds3",
      createdAt: "time stamp",
      body: "this is irrelevant scream to the world",
    },
    {
      userHandle: "test 1",
      scremId: "345*Gsds3",
      createdAt: "time stamp",
      body: "this is irrelevant scream to the world",
    },
  ],
  notifications: [
    {
      recepient: "user",
      sender: "john",
      read: "true | false",
      screamId: "3458*F(*W$H",
      type: "like | comment",
      createdAt: "time stamp",
    },
  ],
};
