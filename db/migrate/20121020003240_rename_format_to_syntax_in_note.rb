class RenameFormatToSyntaxInNote < ActiveRecord::Migration
  def change
    rename_column :notes, :format, :syntax
  end
end
