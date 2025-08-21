// 📦 utils/userid.go
package utils

import (
	"context"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

// 🔹 MongoDB’den son userID’yi alır ve +1 döner
func GetNextUserID(userCollection *mongo.Collection) (int, error) {
	var lastUser struct{ UserID int }
	opts := options.FindOne().SetSort(bson.D{{"userID", -1}})
	err := userCollection.FindOne(context.TODO(), bson.D{}, opts).Decode(&lastUser)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return 100000, nil // 🔹 İlk kullanıcı
		}
		return 0, err
	}
	return lastUser.UserID + 1, nil
}
