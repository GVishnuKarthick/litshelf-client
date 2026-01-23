const UserProfile = () => {
  const user = {
    name: "G. Vishnu",
    email: "g.vishnu@example.com",
    initials: "GV",
    booksRead: 24,
    pagesRead: 7842,
    currentStreak: 12,
    favoriteGenre: "Science Fiction"
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header Card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
        {/* Gradient Background Banner */}
        <div className="h-32 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
        
        <div className="px-8 pb-8">
          {/* Avatar - Overlapping the banner */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-16">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-4xl font-bold shadow-xl border-4 border-white dark:border-gray-900">
              {user.initials}
            </div>
            
            <div className="flex-1 text-center sm:text-left mb-4">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {user.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {user.email}
              </p>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all">
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reading Stats Grid */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Your Reading Journey
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Books Read */}
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-6 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all">
            <BookOpen className="w-8 h-8 mb-3 opacity-90" />
            <div className="text-4xl font-bold mb-1">{user.booksRead}</div>
            <div className="text-purple-100">Books Read in 2026</div>
          </div>

          {/* Pages Read */}
          <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-6 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all">
            <FileText className="w-8 h-8 mb-3 opacity-90" />
            <div className="text-4xl font-bold mb-1">{user.pagesRead.toLocaleString()}</div>
            <div className="text-orange-100">Total Pages</div>
          </div>

          {/* Reading Streak */}
          <div className="bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl p-6 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all">
            <Flame className="w-8 h-8 mb-3 opacity-90" />
            <div className="text-4xl font-bold mb-1">{user.currentStreak}</div>
            <div className="text-blue-100">Day Streak 🔥</div>
          </div>

          {/* Favorite Genre */}
          <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl p-6 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all">
            <Heart className="w-8 h-8 mb-3 opacity-90" />
            <div className="text-2xl font-bold mb-1">{user.favoriteGenre}</div>
            <div className="text-emerald-100">Favorite Genre</div>
          </div>
        </div>
      </div>

      {/* Account Settings Card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Account Settings
        </h2>
        
        <div className="space-y-4">
          {/* Email Notifications */}
          <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Email Notifications</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Receive updates about your reading</p>
              </div>
            </div>
            <button className="w-12 h-6 bg-emerald-500 rounded-full relative transition-colors">
              <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow-md" />
            </button>
          </div>

          {/* Privacy */}
          <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Privacy Settings</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Manage your data and privacy</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>

          {/* Change Password */}
          <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <Key className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Change Password</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Update your password</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>

          {/* Logout Button */}
          <div className="pt-4">
            <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Recent Achievements
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 rounded-xl bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 border border-amber-200 dark:border-amber-800">
            <div className="text-4xl mb-2">📚</div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">Bookworm</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Read 10 books</div>
          </div>

          <div className="text-center p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800">
            <div className="text-4xl mb-2">⚡</div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">Speed Reader</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">7 day streak</div>
          </div>

          <div className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200 dark:border-purple-800">
            <div className="text-4xl mb-2">🎯</div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">Goal Crusher</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">50% to goal</div>
          </div>

          <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800">
            <div className="text-4xl mb-2">⭐</div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">Reviewer</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">5 reviews written</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;