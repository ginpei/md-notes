Rails.application.config.middleware.use OmniAuth::Builder do
  # httpd.conf:
  #     SetEnv MD_NOTES_TW_KEY xxxxxxxxxxxxxxxxxxxx
  #     SetEnv MD_NOTES_TW_SECRET xxxxxxxxxxxxxxxxxxxx
  # and heroku:
  #     heroku config:add MD_NOTES_TW_KEY=xxxxxxxxxxxxxxxxxxxx
  #     heroku config:add MD_NOTES_TW_SECRET=xxxxxxxxxxxxxxxxxxxx
  provider :twitter, ENV['MD_NOTES_TW_KEY'], ENV['MD_NOTES_TW_SECRET']
end
