# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20120930200334) do

  create_table "notes", :force => true do |t|
    t.integer  "user_id",    :null => false
    t.string   "title",      :null => false
    t.text     "body",       :null => false
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  add_index "notes", ["user_id"], :name => "index_notes_on_user_id"

  create_table "users", :force => true do |t|
    t.string   "account",      :null => false
    t.string   "image_url",    :null => false
    t.string   "provider",     :null => false
    t.string   "provider_uid", :null => false
    t.datetime "created_at",   :null => false
    t.datetime "updated_at",   :null => false
  end

  add_index "users", ["account"], :name => "index_users_on_account", :unique => true
  add_index "users", ["provider", "provider_uid"], :name => "index_users_on_provider_and_provider_uid", :unique => true

end
