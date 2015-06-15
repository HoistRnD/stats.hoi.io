set :application, 'stats.hoi.io'
set :repo_url, 'git@github.com:hoist/stats.hoi.io.git'

set :branch, proc { `git rev-parse --abbrev-ref HEAD`.chomp }

set :deploy_to, '/var/www/stats.hoi.io'
# set :scm, :git
set :nvm_type, :user # or :system, depends on your nvm setup
set :nvm_node, 'v0.10.29'
set :nvm_map_bins, %w{node npm}
# set :format, :pretty
# set :log_level, :debug
set :pty, true
set :npm_flags, '--silent --spin false'
# set :linked_files, %w{config/database.yml}
set :linked_dirs, %w{log}

set :copy_files, %w{node_modules}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }
# set :keep_releases, 5

set :slack_team, "hoist" # if your subdomain is kohactive.slack.com
set :slack_token, "0fJCdbo7f3AxAVmtbYFIT9kb" # comes from inbound webhook integration

set :slack_icon_url,     ->{ 'http://qph.is.quoracdn.net/main-qimg-0bf1d3de309a89d9ed70ae91f6271a7f?convert_to_webp=true' }
set :slack_channel,      ->{ '#deploys' }
set :slack_username,     ->{ 'Hoist Deploys' }
set :slack_run_starting, ->{ true }
set :slack_run_finished, ->{ true }


namespace :deploy do

  desc 'Restart application'
  task :restart do
    on roles(:web) do

      #restart existing process
      pm2_restart_command = "cd #{current_path} && pm2 delete #{fetch(:application)}-web; true;"
      puts pm2_restart_command
      execute pm2_restart_command

      #start new process
      pm2_start_command = "cd #{current_path} && NODE_ENV=#{fetch(:node_env,'production')} pm2 start #{current_path}/server.js -i max --merge-logs --name #{fetch(:application)}-web; true"
      puts pm2_start_command
      execute pm2_start_command
    end
  end
    after :published, :restart
end


desc "removes node modules on failure"
task :clean_node_modules do

  on roles(:all) do
    execute "cd #{release_path}; rm -rf node_modules; true"
    execute "rm -rf ~/.npm && rm -rf ~/tmp; true"
  end
end


before 'deploy:failed', 'clean_node_modules'

desc "gather remote logs"
task :log do
  on roles(:all) do
    execute "tail -f ~/.pm2/logs/#{fetch(:application)}-web-out.log"
  end
end
