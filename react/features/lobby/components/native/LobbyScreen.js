// @flow

import React from 'react';
import { Text, View, TextInput } from 'react-native';

import { translate } from '../../../base/i18n';
import JitsiScreen from '../../../base/modal/components/JitsiScreen';
import { LoadingIndicator } from '../../../base/react';
import { connect } from '../../../base/redux';
import { ASPECT_RATIO_NARROW } from '../../../base/responsive-ui';
import BaseTheme from '../../../base/ui/components/BaseTheme';
import Button from '../../../base/ui/components/native/Button';
import { BUTTON_TYPES } from '../../../base/ui/constants';
import { BrandingImageBackground } from '../../../dynamic-branding';
import { LargeVideo } from '../../../large-video/components';
import { navigate }
    from '../../../mobile/navigation/components/lobby/LobbyNavigationContainerRef';
import { screen } from '../../../mobile/navigation/routes';
import AudioMuteButton from '../../../toolbox/components/AudioMuteButton';
import VideoMuteButton from '../../../toolbox/components/VideoMuteButton';
import AbstractLobbyScreen, {
    Props as AbstractProps,
    _mapStateToProps as abstractMapStateToProps } from '../AbstractLobbyScreen';

import styles from './styles';

type Props = AbstractProps & {

    /**
     * The current aspect ratio of the screen.
     */
    _aspectRatio: Symbol
}

/**
 * Implements a waiting screen that represents the participant being in the lobby.
 */
class LobbyScreen extends AbstractLobbyScreen<Props> {
    /**
     * Implements {@code PureComponent#render}.
     *
     * @inheritdoc
     */
    render() {
        const { _aspectRatio } = this.props;
        let contentWrapperStyles;
        let contentContainerStyles;
        let largeVideoContainerStyles;

        if (_aspectRatio === ASPECT_RATIO_NARROW) {
            contentWrapperStyles = styles.contentWrapper;
            largeVideoContainerStyles = styles.largeVideoContainer;
            contentContainerStyles = styles.contentContainer;
        } else {
            contentWrapperStyles = styles.contentWrapperWide;
            largeVideoContainerStyles = styles.largeVideoContainerWide;
            contentContainerStyles = styles.contentContainerWide;
        }

        return (
            <JitsiScreen
                safeAreaInsets = { [ 'left' ] }
                style = { contentWrapperStyles }>
                <BrandingImageBackground />
                <View style = { largeVideoContainerStyles }>
                    <LargeVideo />
                </View>
                <View style = { contentContainerStyles }>
                    { this._renderContent() }
                    { this._renderToolbarButtons() }
                </View>
            </JitsiScreen>
        );
    }

    _getScreenTitleKey: () => string;

    _onAskToJoin: () => void;

    _onCancel: () => boolean;

    _onChangeDisplayName: Object => void;

    _onChangeEmail: Object => void;

    _onChangePassword: Object => void;

    _onEnableEdit: () => void;

    _onJoinWithPassword: () => void;

    _onSwitchToKnockMode: () => void;

    _onSwitchToPasswordMode: () => void;

    _renderContent: () => React$Element<*>;

    _renderToolbarButtons: () => React$Element<*>;

    _onNavigateToLobbyChat: () => void;

    /**
     * Navigates to the lobby chat screen.
     *
     * @private
     * @returns {void}
     */
    _onNavigateToLobbyChat() {
        navigate(screen.lobby.chat);
    }

    /**
     * Renders the joining (waiting) fragment of the screen.
     *
     * @inheritdoc
     */
    _renderJoining() {
        return (
            <View>
                <LoadingIndicator
                    color = { BaseTheme.palette.icon01 }
                    style = { styles.loadingIndicator } />
                <Text style = { styles.joiningMessage }>
                    { this.props.t('lobby.joiningMessage') }
                </Text>
                { this._renderStandardButtons() }
            </View>
        );
    }

    /**
     * Renders the participant form to let the knocking participant enter its details.
     *
     * @inheritdoc
     */
    _renderParticipantForm() {
        const { t } = this.props;
        const { displayName } = this.state;

        return (
            <TextInput
                onChangeText = { this._onChangeDisplayName }
                placeholder = { t('lobby.nameField') }
                style = { styles.field }
                value = { displayName } />
        );
    }

    /**
     * Renders the participant info fragment when we have all the required details of the user.
     *
     * @inheritdoc
     */
    _renderParticipantInfo() {
        return this._renderParticipantForm();
    }

    /**
     * Renders the password form to let the participant join by using a password instead of knocking.
     *
     * @inheritdoc
     */
    _renderPasswordForm() {
        const { _passwordJoinFailed, t } = this.props;

        return (
            <View style = { styles.formWrapper }>
                <TextInput
                    autoCapitalize = 'none'
                    autoCompleteType = 'off'
                    onChangeText = { this._onChangePassword }
                    placeholder = { t('lobby.passwordField') }
                    secureTextEntry = { true }
                    style = { styles.field }
                    value = { this.state.password } />
                { _passwordJoinFailed && <Text style = { styles.fieldError }>
                    { t('lobby.invalidPassword') }
                </Text> }
            </View>
        );
    }

    /**
     * Renders the password join button (set).
     *
     * @inheritdoc
     */
    _renderPasswordJoinButtons() {
        return (
            <View style = { styles.passwordJoinButtonsWrapper }>
                <Button
                    accessibilityLabel = 'lobby.backToKnockModeButton'
                    label = 'lobby.backToKnockModeButton'
                    onPress = { this._onSwitchToKnockMode }
                    style = { styles.lobbyButton }
                    type = { BUTTON_TYPES.PRIMARY } />
                <Button
                    accessibilityLabel = 'lobby.passwordJoinButton'
                    disabled = { !this.state.password }
                    label = 'lobby.passwordJoinButton'
                    onPress = { this._onJoinWithPassword }
                    style = { styles.lobbyButton }
                    type = { BUTTON_TYPES.PRIMARY } />
            </View>
        );
    }

    /**
     * Renders the toolbar buttons menu.
     *
     * @inheritdoc
     */
    _renderToolbarButtons() {
        const { _aspectRatio } = this.props;
        let toolboxContainerStyles;

        if (_aspectRatio === ASPECT_RATIO_NARROW) {
            toolboxContainerStyles = styles.toolboxContainer;
        } else {
            toolboxContainerStyles = styles.toolboxContainerWide;
        }

        return (
            <View style = { toolboxContainerStyles }>
                <AudioMuteButton
                    styles = { styles.buttonStylesBorderless } />
                <VideoMuteButton
                    styles = { styles.buttonStylesBorderless } />
            </View>
        );
    }

    /**
     * Renders the standard button set.
     *
     * @inheritdoc
     */
    _renderStandardButtons() {
        const { _knocking, _renderPassword, _isLobbyChatActive } = this.props;
        const { displayName } = this.state;

        return (
            <View style = { styles.standardButtonWrapper }>
                {
                    _knocking && _isLobbyChatActive
                    && <Button
                        accessibilityLabel = 'toolbar.openChat'
                        label = 'toolbar.openChat'
                        onPress = { this._onNavigateToLobbyChat }
                        style = { styles.openChatButton }
                        type = { BUTTON_TYPES.PRIMARY } />
                }
                {
                    _knocking
                    || <Button
                        accessibilityLabel = 'lobby.knockButton'
                        disabled = { !displayName }
                        label = 'lobby.knockButton'
                        onPress = { this._onAskToJoin }
                        style = { styles.lobbyButton }
                        type = { BUTTON_TYPES.PRIMARY } />
                }
                {
                    _renderPassword
                    && <Button
                        accessibilityLabel = 'lobby.enterPasswordButton'
                        label = 'lobby.enterPasswordButton'
                        onPress = { this._onSwitchToPasswordMode }
                        style = { styles.enterPasswordButton }
                        type = { BUTTON_TYPES.PRIMARY } />
                }
            </View>
        );
    }
}

/**
 * Maps part of the Redux state to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @param {Props} ownProps - The own props of the component.
 * @returns {{
 *     _aspectRatio: Symbol
 * }}
 */
function _mapStateToProps(state: Object, ownProps: Props) {
    return {
        ...abstractMapStateToProps(state, ownProps),
        _aspectRatio: state['features/base/responsive-ui'].aspectRatio
    };
}

export default translate(connect(_mapStateToProps)(LobbyScreen));
