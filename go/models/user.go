// 📦 models/user.go
package models

type User struct {
	Name      string `bson:"name"`
	Role      string `bson:"role"`
	Image     string `bson:"image"`
	Firstname string `bson:"firstname"`
	Lastname  string `bson:"lastname"`
	Username  string `bson:"username"`
	Email     string `bson:"email"`
	Password  string `bson:"password"`
	Age       int    `bson:"age"`
	UserID    int    `bson:"userID"`
	CreatedAt string `bson:"createdAt"`
	UpdatedAt string `bson:"updatedAt"`
}
