// 📦 models/session.go
package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// 🔹 Session: Aktif kullanıcı oturumlarını temsil eder
type Session struct {
	ID         primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID     int                `bson:"userID" json:"userID"`         // User.UserID ile eşleşir
	Token      string             `bson:"token" json:"token"`           // JWT token string
	ExpiresAt  time.Time          `bson:"expiresAt" json:"expiresAt"`   // Token bitiş zamanı
	CreatedAt  time.Time          `bson:"createdAt" json:"createdAt"`   // Oluşturulma zamanı
	IPAddress  string             `bson:"ipAddress" json:"ipAddress"`   // Login IP'si
	UserAgent  string             `bson:"userAgent" json:"userAgent"`   // Tarayıcı/cihaz bilgisi
	DeviceType string             `bson:"deviceType" json:"deviceType"` // "desktop", "mobile", "tablet"
}

// 🔹 IsExpired: Session'ın süresinin dolup dolmadığını kontrol eder
func (s *Session) IsExpired() bool {
	return time.Now().After(s.ExpiresAt)
}
