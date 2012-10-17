class AddFormatToNote < ActiveRecord::Migration
  def change
    add_column :notes, :format, :integer, null: false, default: Note::FORMAT_MARKDOWN
  end
end
