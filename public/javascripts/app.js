(function(/*! Brunch !*/) {
  'use strict';

  if (!this.require) {
    var modules = {};
    var cache = {};
    var __hasProp = ({}).hasOwnProperty;

    var expand = function(root, name) {
      var results = [], parts, part;
      if (/^\.\.?(\/|$)/.test(name)) {
        parts = [root, name].join('/').split('/');
      } else {
        parts = name.split('/');
      }
      for (var i = 0, length = parts.length; i < length; i++) {
        part = parts[i];
        if (part == '..') {
          results.pop();
        } else if (part != '.' && part != '') {
          results.push(part);
        }
      }
      return results.join('/');
    };

    var getFullPath = function(path, fromCache) {
      var store = fromCache ? cache : modules;
      var dirIndex;
      if (__hasProp.call(store, path)) return path;
      dirIndex = expand(path, './index');
      if (__hasProp.call(store, dirIndex)) return dirIndex;
    };
    
    var cacheModule = function(name, path, contentFn) {
      var module = {id: path, exports: {}};
      try {
        cache[path] = module.exports;
        contentFn(module.exports, function(name) {
          return require(name, dirname(path));
        }, module);
        cache[path] = module.exports;
      } catch (err) {
        delete cache[path];
        throw err;
      }
      return cache[path];
    };

    var require = function(name, root) {
      var path = expand(root, name);
      var fullPath;

      if (fullPath = getFullPath(path, true)) {
        return cache[fullPath];
      } else if (fullPath = getFullPath(path, false)) {
        return cacheModule(name, fullPath, modules[fullPath]);
      } else {
        throw new Error("Cannot find module '" + name + "'");
      }
    };

    var dirname = function(path) {
      return path.split('/').slice(0, -1).join('/');
    };

    this.require = function(name) {
      return require(name, '');
    };

    this.require.brunch = true;
    this.require.define = function(bundle) {
      for (var key in bundle) {
        if (__hasProp.call(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    };
  }
}).call(this);
(this.require.define({
  "application": function(exports, require, module) {
    (function() {
  var Application, Collection, Conversation, Message;

  Conversation = require('models/conversation');

  Message = require('models/message');

  Collection = require('models/collection');

  Application = {
    initialize: function(io_host, io_port) {
      var HomeView, Router, User, UsersView,
        _this = this;
      this.io_host = io_host;
      this.io_port = io_port;
      HomeView = require('views/home_view');
      UsersView = require('views/users_view');
      User = require('models/user');
      Router = require('lib/router');
      this.user = null;
      this.channel = null;
      this.conversations = {};
      this.all_users = new Collection([
        new User({
          id: 1,
          name: 'Arnold'
        }), new User({
          id: 2,
          name: 'Bruce'
        }), new User({
          id: 3,
          name: 'Chris'
        })
      ]);
      this.homeView = new HomeView(this);
      this.usersView = new UsersView({
        collection: this.all_users
      });
      this.router = new Router();
      return head.js("http://" + this.io_host + ":" + this.io_port + "/socket.io/socket.io.js", function() {
        var url;
        console.log('connecting to socket', url = "http://" + _this.io_host + ":" + _this.io_port);
        _this.socket = io.connect(url);
        _this.socket.on('joined', function(data) {
          console.log('joined', data);
          return _this.socket.on('receive', function(data) {
            var conversation, correspondent_id;
            console.log('app: received', data);
            if ((correspondent_id = data.from) != null) {
              conversation = _this.start_chat_with(_this.all_users.get(correspondent_id));
              return conversation.receive(new Message(data));
            }
          });
        });
        return _this.router.home();
      });
    },
    set_user: function(user) {
      console.log('set user', this.user);
      if (!(this.user != null) || user.id !== this.user.id) {
        this.user = user;
        this.socket.emit('join', {
          channel: this.channel = this.user.id
        });
        return this.router.home();
      }
    },
    start_chat_with: function(other) {
      var conversation, _base, _name;
      if (!(this.user != null) || !(other != null)) return false;
      conversation = ((_base = this.conversations)[_name = other.id] || (_base[_name] = new Conversation(this.socket, this.user, new Collection([other]))));
      this.homeView.show_chat_view_for(conversation);
      return conversation;
    }
  };

  module.exports = Application;

}).call(this);

  }
}));
(this.require.define({
  "initialize": function(exports, require, module) {
    (function() {
  var application;

  application = require('application');

  $(function() {
    return application.initialize('localhost', 3000);
  });

}).call(this);

  }
}));
(this.require.define({
  "lib/router": function(exports, require, module) {
    (function() {
  var Router, app,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  app = require('application');

  module.exports = Router = (function(_super) {

    __extends(Router, _super);

    function Router() {
      Router.__super__.constructor.apply(this, arguments);
    }

    Router.prototype.routes = {
      '': 'home'
    };

    Router.prototype.home = function() {
      if (!(app.user != null)) return this.select_user();
      return $('body').html(app.homeView.render().el);
    };

    Router.prototype.select_user = function() {
      return $('body').html(app.usersView.render().el);
    };

    return Router;

  })(Backbone.Router);

}).call(this);

  }
}));
(this.require.define({
  "lib/view_helper": function(exports, require, module) {
    (function() {



}).call(this);

  }
}));
(this.require.define({
  "models/collection": function(exports, require, module) {
    (function() {
  var Collection,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  module.exports = Collection = (function(_super) {

    __extends(Collection, _super);

    function Collection() {
      Collection.__super__.constructor.apply(this, arguments);
    }

    return Collection;

  })(Backbone.Collection);

}).call(this);

  }
}));
(this.require.define({
  "models/conversation": function(exports, require, module) {
    (function() {
  var Conversation, Message, Model, application,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  application = require('/application');

  Model = require('./model');

  Message = require('/models/message');

  module.exports = Conversation = (function(_super) {

    __extends(Conversation, _super);

    function Conversation(socket, local, remotes) {
      this.socket = socket;
      this.local = local;
      this.remotes = remotes;
      Conversation.__super__.constructor.call(this);
    }

    Conversation.prototype.initialize = function() {};

    Conversation.prototype.post_body = function(string) {
      return this.post(new Message({
        body: string,
        sender: this.local
      }));
    };

    Conversation.prototype.post = function(message) {
      var socket_message,
        _this = this;
      this.set('sending', true);
      socket_message = {
        from: message.get('sender').id,
        body: message.get('body')
      };
      this.remotes.each(function(recipient) {
        console.log('posting', {
          channel: recipient.id,
          message: socket_message
        });
        return _this.socket.emit('post', {
          channel: recipient.id,
          message: socket_message
        });
      });
      this.set('sending', false);
      return this.trigger('receive', message);
    };

    Conversation.prototype.receive = function(message) {
      var sender_id;
      if ((sender_id = message.get('from')) != null) {
        message.set('sender', (sender_id === this.local.id ? this.local : this.remotes.get(sender_id)));
      }
      return this.trigger('receive', message);
    };

    return Conversation;

  })(Model);

}).call(this);

  }
}));
(this.require.define({
  "models/message": function(exports, require, module) {
    (function() {
  var Message, Model,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Model = require('./model');

  module.exports = Message = (function(_super) {

    __extends(Message, _super);

    function Message() {
      Message.__super__.constructor.apply(this, arguments);
    }

    Message.prototype.initialize = function() {
      if (!(this.get('time') != null)) {
        return this.set('time', (new Date()).getTime());
      }
    };

    return Message;

  })(Model);

}).call(this);

  }
}));
(this.require.define({
  "models/model": function(exports, require, module) {
    (function() {
  var Model,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  module.exports = Model = (function(_super) {

    __extends(Model, _super);

    function Model() {
      Model.__super__.constructor.apply(this, arguments);
    }

    return Model;

  })(Backbone.Model);

}).call(this);

  }
}));
(this.require.define({
  "models/user": function(exports, require, module) {
    (function() {
  var Model, User,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Model = require('./model');

  module.exports = User = (function(_super) {

    __extends(User, _super);

    function User() {
      User.__super__.constructor.apply(this, arguments);
    }

    return User;

  })(Model);

}).call(this);

  }
}));
(this.require.define({
  "views/chat_view": function(exports, require, module) {
    (function() {
  var ChatView, MessageView, View, template,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  View = require('./view');

  template = require('./templates/chat');

  MessageView = require('./message_view');

  module.exports = ChatView = (function(_super) {

    __extends(ChatView, _super);

    function ChatView() {
      ChatView.__super__.constructor.apply(this, arguments);
    }

    ChatView.prototype.className = 'chat-view';

    ChatView.prototype.template = template;

    ChatView.prototype.events = {
      'click input.send': 'post',
      'keydown input.body': 'keydown'
    };

    ChatView.prototype.initialize = function() {
      var _this = this;
      return this.model.on('receive', function(message) {
        var el, view;
        console.log('chat:received', message);
        view = new MessageView({
          model: message
        });
        el = view.render().$el;
        console.log(el);
        el.appendTo(_this.$('.slider'));
        console.log('scroll');
        return _this.$('.conversation').first().scrollTop(_this.$('.slider').first().height() - _this.$('.conversation').first().height());
      });
    };

    ChatView.prototype.after_render = function() {
      return this.focus();
    };

    ChatView.prototype.keydown = function(evt) {
      console.log(evt.which);
      if (evt.which === 13) return this.$('input.send').click();
    };

    ChatView.prototype.focus = function() {
      return this.$('input.body').focus();
    };

    ChatView.prototype.post = function() {
      var input_body,
        _this = this;
      this.model.post_body((input_body = this.$('input.body')).val());
      input_body.val('');
      this.model.on('change:busy', function(busy) {
        console.log('busy', busy);
        return _this.$('input.send').first().attr('disabled', busy);
      });
      return this.focus();
    };

    ChatView.prototype.get_render_data = function() {
      console.log(this.model.remotes, this.model.remotes.at(0));
      return {
        title: "Chat with " + (this.model.remotes.length > 1 ? this.model.remotes.length + ' people' : this.model.remotes.at(0).get('name'))
      };
    };

    return ChatView;

  })(View);

}).call(this);

  }
}));
(this.require.define({
  "views/home_view": function(exports, require, module) {
    (function() {
  var ChatView, HomeView, View, template,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  View = require('./view');

  template = require('./templates/home');

  ChatView = require('./chat_view');

  module.exports = HomeView = (function(_super) {

    __extends(HomeView, _super);

    HomeView.prototype.id = 'home-view';

    HomeView.prototype.template = template;

    function HomeView(app) {
      this.app = app;
      HomeView.__super__.constructor.call(this);
      this._chat_views = {};
    }

    HomeView.prototype.get_render_data = function() {
      return {
        user: this.user() != null ? this.user().attributes : void 0,
        other_users: this.other_users().map(function(u) {
          return u.attributes;
        })
      };
    };

    HomeView.prototype.user = function() {
      return this.app.user;
    };

    HomeView.prototype.other_users = function() {
      var _this = this;
      return _(this.app.all_users.filter(function(u) {
        return u.id !== _this.user().id;
      }));
    };

    HomeView.prototype.after_render = function() {
      var _this = this;
      return this.other_users().each(function(u) {
        return _this.$('#chat-with-user-' + u.id).click(function() {
          return _this.app.start_chat_with(u);
        });
      });
    };

    HomeView.prototype.show_chat_view_for = function(conversation) {
      var cid, view;
      cid = conversation.cid;
      if (!(this._chat_views[cid] != null)) {
        this._chat_views[cid] = view = new ChatView({
          model: conversation
        });
        this.$('.chat-windows').first().append(view.render().$el);
      }
      return this._chat_views[cid];
    };

    return HomeView;

  })(View);

}).call(this);

  }
}));
(this.require.define({
  "views/message_view": function(exports, require, module) {
    (function() {
  var MessageView, View, template,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  View = require('./view');

  template = require('./templates/message');

  module.exports = MessageView = (function(_super) {

    __extends(MessageView, _super);

    function MessageView() {
      MessageView.__super__.constructor.apply(this, arguments);
    }

    MessageView.prototype.className = 'message';

    MessageView.prototype.template = template;

    MessageView.prototype.get_render_data = function() {
      return {
        body: this.model.get('body'),
        time: this.model.get('time'),
        sender: {
          name: this.model.get('sender').get('name')
        }
      };
    };

    return MessageView;

  })(View);

}).call(this);

  }
}));
(this.require.define({
  "views/templates/chat": function(exports, require, module) {
    module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, foundHelper, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;


  buffer += "<div class='inner'>\n  <div class='title'>";
  foundHelper = helpers.title;
  stack1 = foundHelper || depth0.title;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "title", { hash: {} }); }
  buffer += escapeExpression(stack1) + "</div>\n  <div class='conversation'>\n    <div class='slider'></div>\n  </div>\n  <div class='send'>\n    <input type='text' name='body' class='body' />\n    <input type='button' name='send' class='send' value='Send' /> \n  </div>\n</div>";
  return buffer;});
  }
}));
(this.require.define({
  "views/templates/home": function(exports, require, module) {
    module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\n    ";
  foundHelper = helpers.user;
  stack1 = foundHelper || depth0.user;
  stack2 = helpers['with'];
  tmp1 = self.program(2, program2, data);
  tmp1.hash = {};
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  stack1 = stack2.call(depth0, stack1, tmp1);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  ";
  return buffer;}
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <div id=\"topbar\">Logged in as ";
  foundHelper = helpers.name;
  stack1 = foundHelper || depth0.name;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "name", { hash: {} }); }
  buffer += escapeExpression(stack1) + "</div>\n    ";
  return buffer;}

function program4(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\n  Who do you want to chat with?\n  <div class='users'>\n    ";
  foundHelper = helpers.other_users;
  stack1 = foundHelper || depth0.other_users;
  stack2 = helpers.each;
  tmp1 = self.program(5, program5, data);
  tmp1.hash = {};
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  stack1 = stack2.call(depth0, stack1, tmp1);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  </div>\n  ";
  return buffer;}
function program5(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n      <div class='user'>\n        <input id='chat-with-user-";
  foundHelper = helpers.id;
  stack1 = foundHelper || depth0.id;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "id", { hash: {} }); }
  buffer += escapeExpression(stack1) + "' type='button' value='Chat with ";
  foundHelper = helpers.name;
  stack1 = foundHelper || depth0.name;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "name", { hash: {} }); }
  buffer += escapeExpression(stack1) + "' />\n      </div>\n    ";
  return buffer;}

  buffer += "<div id=\"content\">\n  ";
  foundHelper = helpers.user;
  stack1 = foundHelper || depth0.user;
  stack2 = helpers['if'];
  tmp1 = self.program(1, program1, data);
  tmp1.hash = {};
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  stack1 = stack2.call(depth0, stack1, tmp1);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  ";
  foundHelper = helpers.other_users;
  stack1 = foundHelper || depth0.other_users;
  stack2 = helpers['if'];
  tmp1 = self.program(4, program4, data);
  tmp1.hash = {};
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  stack1 = stack2.call(depth0, stack1, tmp1);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  <div class='chat-windows'>\n  </div>\n</div>\n";
  return buffer;});
  }
}));
(this.require.define({
  "views/templates/message": function(exports, require, module) {
    module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, foundHelper, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;


  buffer += "<div class='body'><b>";
  foundHelper = helpers.sender;
  stack1 = foundHelper || depth0.sender;
  stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.name);
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "sender.name", { hash: {} }); }
  buffer += escapeExpression(stack1) + " says: </b>";
  foundHelper = helpers.body;
  stack1 = foundHelper || depth0.body;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "body", { hash: {} }); }
  buffer += escapeExpression(stack1) + "</div>\n<div class='time'>";
  foundHelper = helpers.time;
  stack1 = foundHelper || depth0.time;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "time", { hash: {} }); }
  buffer += escapeExpression(stack1) + "</div>";
  return buffer;});
  }
}));
(this.require.define({
  "views/templates/user": function(exports, require, module) {
    module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, foundHelper, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;


  buffer += "<div class='user'>\n<input type='button' value='";
  foundHelper = helpers.name;
  stack1 = foundHelper || depth0.name;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "name", { hash: {} }); }
  buffer += escapeExpression(stack1) + "' class='choose' />\n</div>";
  return buffer;});
  }
}));
(this.require.define({
  "views/templates/users": function(exports, require, module) {
    module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var foundHelper, self=this;


  return "<div id='content'>\n  Choose a user\n\n  <div class='users'></div>\n</div>";});
  }
}));
(this.require.define({
  "views/user_view": function(exports, require, module) {
    (function() {
  var UserView, View, application, template,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  application = require('/application');

  template = require('views/templates/user');

  View = require('./view');

  module.exports = UserView = (function(_super) {

    __extends(UserView, _super);

    function UserView() {
      UserView.__super__.constructor.apply(this, arguments);
    }

    UserView.prototype.template = template;

    UserView.prototype.get_render_data = function() {
      return this.model.attributes;
    };

    UserView.prototype.after_render = function() {
      var _this = this;
      console.log(this.$('input.choose'));
      return this.$('input.choose').click(function() {
        console.log('click');
        return application.set_user(_this.model);
      });
    };

    return UserView;

  })(View);

}).call(this);

  }
}));
(this.require.define({
  "views/users_view": function(exports, require, module) {
    (function() {
  var UserView, UsersView, View, template,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  template = require('views/templates/users');

  View = require('./view');

  UserView = require('./user_view');

  module.exports = UsersView = (function(_super) {

    __extends(UsersView, _super);

    function UsersView() {
      UsersView.__super__.constructor.apply(this, arguments);
    }

    UsersView.prototype.template = template;

    UsersView.prototype.initialize = function() {};

    UsersView.prototype.after_render = function() {
      var container;
      console.log('rendered');
      container = this.$('.users').first().empty();
      return this.collection.each(function(u) {
        var view;
        view = new UserView({
          model: u
        });
        return container.append(view.render().$el);
      });
    };

    return UsersView;

  })(View);

}).call(this);

  }
}));
(this.require.define({
  "views/view": function(exports, require, module) {
    (function() {
  var View,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  require('lib/view_helper');

  module.exports = View = (function(_super) {

    __extends(View, _super);

    function View() {
      this.render = __bind(this.render, this);
      View.__super__.constructor.apply(this, arguments);
    }

    View.prototype.template = function() {};

    View.prototype.get_render_data = function() {};

    View.prototype.render = function() {
      this.$el.html(this.template(this.get_render_data()));
      this.after_render();
      return this;
    };

    View.prototype.after_render = function() {};

    return View;

  })(Backbone.View);

}).call(this);

  }
}));
