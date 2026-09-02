import React, {
  useState,
  useContext,
} from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';

import { StatusBar } from 'expo-status-bar';

import DateTimePicker from '@react-native-community/datetimepicker';

import AuthLayout from '../../Components/Auth/AuthLayout';
import { AuthContext } from '../../Context/AuthContext';

import AppLogo from '../../Components/Auth/AppLogo';
import FormInput from '../../Components/Common/FormInput';
import Button from '../../Components/Common/Button';

import { COLORS } from '../../Constants/theme';

import authService from '../../Services/authService';

import { RegisterStyles as styles } from '../../Styles';


const RegisterScreen = ({ navigation }) => {

  // ==================================================
  // FORMULARIO
  // ==================================================

  const [formData, setFormData] = useState({

    name: '',
    lastname: '',
    birthdate: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    DUI: '',

  });


  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});

  const [showDatePicker, setShowDatePicker] =
    useState(false);


  // ==================================================
  // FECHA
  // ==================================================

  const handleDateChange = (
    event,
    selectedDate
  ) => {

    setShowDatePicker(false);

    if (selectedDate) {

      const dateString =
        selectedDate
          .toISOString()
          .split('T')[0];

      handleChange(
        'birthdate',
        dateString
      );

    }
  };


  // ==================================================
  // CAMBIAR CAMPO
  // ==================================================

  const handleChange = (
    field,
    value
  ) => {

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));


    if (errors[field]) {

      setErrors((prev) => ({
        ...prev,
        [field]: null,
      }));

    }
  };


  // ==================================================
  // TELÉFONO
  // ==================================================

  const handlePhoneChange = (
    text
  ) => {

    let cleaned =
      text.replace(/\D/g, '');


    if (cleaned.length > 4) {

      cleaned =
        cleaned.substring(0, 4) +
        '-' +
        cleaned.substring(4, 8);

    }


    handleChange(
      'phone',
      cleaned
    );
  };


  // ==================================================
  // DUI
  // ==================================================

  const handleDUIChange = (
    text
  ) => {

    let cleaned =
      text.replace(/\D/g, '');


    if (cleaned.length > 8) {

      cleaned =
        cleaned.substring(0, 8) +
        '-' +
        cleaned.substring(8, 9);

    }


    handleChange(
      'DUI',
      cleaned
    );
  };


  // ==================================================
  // VALIDACIÓN
  // ==================================================

  const validateForm = () => {

    const newErrors = {};


    if (
      !formData.name ||
      formData.name.length < 3
    ) {

      newErrors.name =
        'Nombre inválido';

    }


    if (
      !formData.lastname ||
      formData.lastname.length < 3
    ) {

      newErrors.lastname =
        'Apellido inválido';

    }


    if (!formData.birthdate) {

      newErrors.birthdate =
        'Fecha requerida';

    }

    else if (
      !/^\d{4}-\d{2}-\d{2}$/.test(
        formData.birthdate
      )
    ) {

      newErrors.birthdate =
        'Formato: YYYY-MM-DD';

    }


    if (
      !formData.phone ||
      !/^[0-9]{4}-[0-9]{4}$/.test(
        formData.phone
      )
    ) {

      newErrors.phone =
        'Teléfono de 8 dígitos';

    }


    if (
      !formData.email ||
      !/\S+@\S+\.\S+/.test(
        formData.email
      )
    ) {

      newErrors.email =
        'Email inválido';

    }


    if (
      !formData.DUI ||
      !/^\d{8}-\d$/.test(
        formData.DUI
      )
    ) {

      newErrors.DUI =
        'Formato: 12345678-9';

    }


    if (
      !formData.password ||
      formData.password.length < 8
    ) {

      newErrors.password =
        'Mínimo 8 caracteres';

    }


    if (
      formData.password !==
      formData.confirmPassword
    ) {

      newErrors.confirmPassword =
        'No coinciden';

    }


    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );

  };


  // ==================================================
  // AUTH
  // ==================================================

  const { login } =
    useContext(AuthContext);


  // ==================================================
  // REGISTRO
  // ==================================================

  const handleRegister = async () => {

    if (!validateForm()) {
      return;
    }


    setLoading(true);


    try {

      const result =
        await authService.register({
          ...formData,
          isActive: true,
        });


      if (result.success) {

        // Inicio de sesión automático

        const loginResult =
          await login(
            formData.email,
            formData.password
          );


        if (loginResult.success) {

          Alert.alert(
            '¡Bienvenido!',
            'Tu cuenta fue creada exitosamente.'
          );

        }

        else {

          Alert.alert(
            '¡Cuenta creada!',
            'Tu cuenta fue creada, pero hubo un error al iniciar sesión automáticamente.',
            [
              {
                text: 'Iniciar sesión',
                onPress: () =>
                  navigation.navigate(
                    'Login'
                  ),
              },
            ]
          );

        }

      }

      else {

        Alert.alert(
          'Error al registrarse',
          result.message ||
            'Intenta de nuevo más tarde.'
        );

      }

    }

    catch (error) {

      Alert.alert(
        'Error',
        'No se pudo conectar al servidor. Verifica tu conexión a internet.'
      );

    }

    finally {

      setLoading(false);

    }

  };


  // ==================================================
  // RENDER
  // ==================================================

  return (

    <AuthLayout>

      <StatusBar style="dark" />


      {/* ============================================
          HEADER
      ============================================ */}

      <View style={styles.header}>

        <AppLogo
          size={72}
          showShadow
        />


        <Text style={styles.title}>
          Crear cuenta
        </Text>


        <Text style={styles.subtitle}>
          Únete a la comunidad Plumas Volando
        </Text>

      </View>


      {/* ============================================
          FORMULARIO
      ============================================ */}

      <View style={styles.form}>


        {/* NOMBRE */}

        <FormInput
          label="Nombre"
          value={formData.name}
          onChangeText={(v) =>
            handleChange('name', v)
          }
          error={errors.name}
          icon="person-outline"
          placeholder="Tu nombre"
        />


        {/* APELLIDOS */}

        <FormInput
          label="Apellidos"
          value={formData.lastname}
          onChangeText={(v) =>
            handleChange(
              'lastname',
              v
            )
          }
          error={errors.lastname}
          icon="people-outline"
          placeholder="Tus apellidos"
        />


        {/* FECHA DE NACIMIENTO */}

        <TouchableOpacity
          onPress={() =>
            setShowDatePicker(true)
          }
          activeOpacity={0.8}
        >

          <View
            pointerEvents="none"
          >

            <FormInput
              label="Fecha de nacimiento"
              value={formData.birthdate}
              error={errors.birthdate}
              icon="calendar-outline"
              placeholder="YYYY-MM-DD"
              editable={false}
            />

          </View>

        </TouchableOpacity>


        {/* DATE PICKER */}

        {showDatePicker && (

          <DateTimePicker

            value={
              formData.birthdate
                ? new Date(
                    formData.birthdate
                  )
                : new Date(
                    new Date().setFullYear(
                      new Date().getFullYear() -
                        15
                    )
                  )
            }

            mode="date"

            display="default"

            onChange={
              handleDateChange
            }

            minimumDate={
              new Date(1893, 0, 1)
            }

            maximumDate={
              new Date(
                new Date().setFullYear(
                  new Date().getFullYear() -
                    15
                )
              )
            }

          />

        )}


        {/* TELÉFONO */}

        <FormInput
          label="Teléfono"
          value={formData.phone}
          onChangeText={
            handlePhoneChange
          }
          error={errors.phone}
          keyboardType="phone-pad"
          icon="call-outline"
          placeholder="0000-0000"
          maxLength={9}
        />


        {/* CORREO */}

        <FormInput
          label="Correo electrónico"
          value={formData.email}
          onChangeText={(v) =>
            handleChange(
              'email',
              v
            )
          }
          error={errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
          icon="mail-outline"
          placeholder="ejemplo@correo.com"
        />


        {/* DUI */}

        <FormInput
          label="DUI"
          value={formData.DUI}
          onChangeText={
            handleDUIChange
          }
          error={errors.DUI}
          icon="card-outline"
          placeholder="12345678-9"
          maxLength={10}
        />


        {/* CONTRASEÑA */}

        <FormInput
          label="Contraseña"
          value={formData.password}
          onChangeText={(v) =>
            handleChange(
              'password',
              v
            )
          }
          error={errors.password}
          secureTextEntry
          icon="lock-closed-outline"
          placeholder="Mínimo 8 caracteres"
        />


        {/* CONFIRMAR CONTRASEÑA */}

        <FormInput
          label="Confirmar contraseña"
          value={
            formData.confirmPassword
          }
          onChangeText={(v) =>
            handleChange(
              'confirmPassword',
              v
            )
          }
          error={
            errors.confirmPassword
          }
          secureTextEntry
          icon="lock-closed-outline"
          placeholder="Repite tu contraseña"
        />

      </View>


      {/* ============================================
          ACCIONES
      ============================================ */}

      <View style={styles.actions}>

        <Button
          title="Crear cuenta"
          onPress={handleRegister}
          loading={loading}
          disabled={loading}
        />


        {/* IR A LOGIN */}

        <TouchableOpacity
          style={styles.loginLink}
          onPress={() =>
            navigation.navigate(
              'Login'
            )
          }
          activeOpacity={0.7}
        >

          <Text
            style={styles.loginLinkText}
          >

            ¿Ya tienes cuenta?{' '}

            <Text
              style={
                styles.loginLinkHighlight
              }
            >
              Inicia sesión
            </Text>

          </Text>

        </TouchableOpacity>

      </View>

    </AuthLayout>

  );
};


export default RegisterScreen;