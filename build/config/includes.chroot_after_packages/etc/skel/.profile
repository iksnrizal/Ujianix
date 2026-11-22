# ~/.profile: executed by the command interpreter for login shells.
# This file is not read by bash(1), if ~/.bash_profile or ~/.bash_login
# exists.
# see /usr/share/doc/bash/examples/startup-files for examples.
# the files are located in the bash-doc package.

# the default umask is set in /etc/profile; for setting the umask
# for ssh logins, install and configure the libpam-umask package.
#umask 022

# if running bash
if [ -n "$BASH_VERSION" ]; then
    # include .bashrc if it exists
    if [ -f "$HOME/.bashrc" ]; then
	. "$HOME/.bashrc"
    fi
fi

# set PATH so it includes user's private bin if it exists
if [ -d "$HOME/bin" ] ; then
    PATH="$HOME/bin:$PATH"
fi

# set PATH so it includes user's private bin if it exists
if [ -d "$HOME/.local/bin" ] ; then
    PATH="$HOME/.local/bin:$PATH"
fi

export LANG=id_ID.UTF-8 LANGUAGE=id
# Ujianix boot mode: Try atau Install
if [ "$(tty 2>/dev/null)" = "/dev/tty1" ] &&
   [ -z "${UJIANIX_SESSION:-}" ]; then
    export UJIANIX_SESSION=1

    if [ "$(/usr/local/sbin/ujianix-boot-mode)" = "install" ]; then
        exec /usr/local/bin/ujianix-installer
    else
        if [ -r /run/ujianix/server-url ]; then
            UJIANIX_URL="$(cat /run/ujianix/server-url)"
            WLR_RENDERER=pixman exec /usr/bin/cage -- /usr/bin/firefox-esr --kiosk "$UJIANIX_URL"
        else
            i=0; while [ "$i" -lt 20 ] && ! python3 -c "import socket; socket.create_connection(('127.0.0.1', 8765), 1)" 2>/dev/null; do i=$((i+1)); sleep 0.5; done; WLR_RENDERER=pixman exec /usr/bin/cage -- /usr/bin/firefox-esr --kiosk http://127.0.0.1:8765/setup
        fi
    fi
fi
